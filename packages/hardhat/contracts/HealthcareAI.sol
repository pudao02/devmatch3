// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract HealthcareAI is Ownable {
    constructor() Ownable(msg.sender) {}
    
    struct Prompt {
        string prompt;
        uint256 timestamp;
        bool isConfidential;
    }

    struct Response {
        string output;
        uint256 timestamp;
        bool isConfidential;
    }

    struct Feedback {
        uint8 rating;
        string comment;
        uint256 timestamp;
        bool isConfidential;
    }

    // Enhanced confidential mappings with explicit confidentiality flags
    mapping(address => Prompt[]) private userPrompts;
    mapping(address => Response[]) private userResponses;
    mapping(address => Feedback[]) private userFeedbacks;
    
    // Confidential storage for sensitive data
    mapping(address => mapping(uint256 => bytes32)) private confidentialPromptHashes;
    mapping(address => mapping(uint256 => bytes32)) private confidentialResponseHashes;
    mapping(address => mapping(uint256 => bytes32)) private confidentialFeedbackHashes;

    // Address allowed to store AI responses (AI backend)
    address public aiBackend;

    event PromptSubmitted(address indexed user, uint256 promptId, bool isConfidential);
    event ResponseStored(address indexed user, uint256 responseId, bool isConfidential);
    event FeedbackSubmitted(address indexed user, uint256 promptId, bool isConfidential);
    event AIBackendChanged(address indexed newBackend);

    modifier onlyAIBackend() {
        require(msg.sender == aiBackend, "Not authorized");
        _;
    }

    // Set the AI backend address (only owner)
    function setAIBackend(address _backend) external onlyOwner {
        aiBackend = _backend;
        emit AIBackendChanged(_backend);
    }

    // Enhanced user submits a prompt with confidentiality option
    function submitPrompt(string calldata prompt, bool makeConfidential) external {
        uint256 promptId = userPrompts[msg.sender].length;
        
        // Store the prompt with confidentiality flag
        userPrompts[msg.sender].push(Prompt(prompt, block.timestamp, makeConfidential));
        
        // If confidential, also store a hash for additional security
        if (makeConfidential) {
            confidentialPromptHashes[msg.sender][promptId] = keccak256(abi.encodePacked(prompt, block.timestamp, msg.sender));
        }
        
        emit PromptSubmitted(msg.sender, promptId, makeConfidential);
    }

    // Enhanced AI backend stores the response with confidentiality
    function storeResponse(address user, string calldata output, bool makeConfidential) external onlyAIBackend {
        uint256 responseId = userResponses[user].length;
        
        // Store the response with confidentiality flag
        userResponses[user].push(Response(output, block.timestamp, makeConfidential));
        
        // If confidential, also store a hash for additional security
        if (makeConfidential) {
            confidentialResponseHashes[user][responseId] = keccak256(abi.encodePacked(output, block.timestamp, user));
        }
        
        emit ResponseStored(user, responseId, makeConfidential);
    }

    // Enhanced user submits feedback with confidentiality
    function submitFeedback(uint promptId, uint8 rating, string calldata comment, bool makeConfidential) external {
        require(promptId < userPrompts[msg.sender].length, "Invalid promptId");
        
        uint256 feedbackId = userFeedbacks[msg.sender].length;
        
        // Store the feedback with confidentiality flag
        userFeedbacks[msg.sender].push(Feedback(rating, comment, block.timestamp, makeConfidential));
        
        // If confidential, also store a hash for additional security
        if (makeConfidential) {
            confidentialFeedbackHashes[msg.sender][feedbackId] = keccak256(abi.encodePacked(rating, comment, block.timestamp, msg.sender));
        }
        
        emit FeedbackSubmitted(msg.sender, promptId, makeConfidential);
    }

    // User retrieves their own history (confidential data is still accessible to the user)
    function getMyPrompts() external view returns (Prompt[] memory) {
        return userPrompts[msg.sender];
    }

    function getMyResponses() external view returns (Response[] memory) {
        return userResponses[msg.sender];
    }

    function getMyFeedbacks() external view returns (Feedback[] memory) {
        return userFeedbacks[msg.sender];
    }

    // Get confidentiality status for specific items
    function getPromptConfidentiality(address user, uint256 promptId) external view returns (bool) {
        require(promptId < userPrompts[user].length, "Invalid promptId");
        return userPrompts[user][promptId].isConfidential;
    }

    function getResponseConfidentiality(address user, uint256 responseId) external view returns (bool) {
        require(responseId < userResponses[user].length, "Invalid responseId");
        return userResponses[user][responseId].isConfidential;
    }

    function getFeedbackConfidentiality(address user, uint256 feedbackId) external view returns (bool) {
        require(feedbackId < userFeedbacks[user].length, "Invalid feedbackId");
        return userFeedbacks[user][feedbackId].isConfidential;
    }

    // Verify data integrity for confidential items
    function verifyPromptIntegrity(uint256 promptId) external view returns (bool) {
        require(promptId < userPrompts[msg.sender].length, "Invalid promptId");
        Prompt memory prompt = userPrompts[msg.sender][promptId];
        
        if (!prompt.isConfidential) return true;
        
        bytes32 expectedHash = keccak256(abi.encodePacked(prompt.prompt, prompt.timestamp, msg.sender));
        return confidentialPromptHashes[msg.sender][promptId] == expectedHash;
    }
}