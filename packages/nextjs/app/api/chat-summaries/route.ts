import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "chat-summaries");

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

export async function GET() {
  try {
    await ensureDataDir();
    const files = await fs.readdir(DATA_DIR);
    const summaries = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        const content = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
        summaries.push(JSON.parse(content));
      }
    }

    return NextResponse.json(summaries);
  } catch {
    return NextResponse.json({ error: "Failed to load summaries" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataDir();
    const summary = await request.json();

    const filename = `summary-${summary.id}.json`;
    const filepath = path.join(DATA_DIR, filename);

    await fs.writeFile(filepath, JSON.stringify(summary, null, 2));

    return NextResponse.json({ success: true, filename });
  } catch {
    return NextResponse.json({ error: "Failed to save summary" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Summary ID required" }, { status: 400 });
    }

    const filename = `summary-${id}.json`;
    const filepath = path.join(DATA_DIR, filename);

    await fs.unlink(filepath);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete summary" }, { status: 500 });
  }
}
