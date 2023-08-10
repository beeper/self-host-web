import { NextResponse } from 'next/server'



export async function GET(request: Request) {

    const child_process = require('child_process');
    const ls = child_process.exec('ls');
    const output = ls.stdout.toString();
    console.log(JSON.stringify(output))
    return NextResponse.json({ "hi": "hello" })
}