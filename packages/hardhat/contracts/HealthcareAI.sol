// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract HealthcareAI is Ownable {
    struct Prompt {
        string prompt;
        uint256 timestamp;
    }

    struct Response {
        string output;
        uint256 timestamp;
    }

    struct Feedback {
        uint8 rating;
        string comment;
        uint256 timestamp;
    }

    // Confidential mappings (Sapphire: all state is confidential by default)
    mapping(address => Prompt[]) private userPrompts;
    mapping(address => Response[]) private userResponses;
    mapping(address => Feedback[]) private userFeedbacks;

    // Address allowed to store AI responses (AI backend)
    address public aiBackend;

    event PromptSubmitted(address indexed user, uint256 promptId);
    event ResponseStored(address indexed user, uint256 responseId);
    event FeedbackSubmitted(address indexed user, uint256 promptId);
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

    // User submits a prompt
    function submitPrompt(string calldata prompt) external {
        userPrompts[msg.sender].push(Prompt(prompt, block.timestamp));
        emit PromptSubmitted(msg.sender, userPrompts[msg.sender].length - 1);
    }

    // AI backend stores the response
    function storeResponse(address user, string calldata output) external onlyAIBackend {
        userResponses[user].push(Response(output, block.timestamp));
        emit ResponseStored(user, userResponses[user].length - 1);
    }

    // User submits feedback for a prompt/response
    function submitFeedback(uint promptId, uint8 rating, string calldata comment) external {
        require(promptId < userPrompts[msg.sender].length, "Invalid promptId");
        userFeedbacks[msg.sender].push(Feedback(rating, comment, block.timestamp));
        emit FeedbackSubmitted(msg.sender, promptId);
    }

    // User retrieves their own history
    function getMyPrompts() external view returns (Prompt[] memory) {
        return userPrompts[msg.sender];
    }

    function getMyResponses() external view returns (Response[] memory) {
        return userResponses[msg.sender];
    }

    function getMyFeedbacks() external view returns (Feedback[] memory) {
        return userFeedbacks[msg.sender];
    }
}