#!/bin/bash

echo "Setting up Quantum Mechanics Backend..."

uv venv
source .venv/bin/activate
uv pip install -r requirements.txt

echo "Backend setup complete!"
echo "To start the server, run:"
echo "  source .venv/bin/activate"
echo "  uvicorn app.main:app --reload --port 8000"
