# distress_detection_app.py

import os
import requests
import gradio as gr
from dotenv import load_dotenv

# Load Hugging Face token from .env
load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")

ALERT_KEYWORDS = ["help", "danger", "save me", "emergency", "fire", "kidnap"]

def transcribe_audio(audio_path):
    with open(audio_path, "rb") as f:
        audio_bytes = f.read()

    response = requests.post(
        "https://api-inference.huggingface.co/models/openai/whisper-small",
        headers={
            "Authorization": f"Bearer {HF_TOKEN}",
            "Content-Type": "audio/wav"
        },
        data=audio_bytes
    )
    result = response.json()
    return result.get("text", "")

def process_input(audio, text_input):
    transcribed_text = ""

    if audio is not None:
        transcribed_text = transcribe_audio(audio)

    final_input = f"{transcribed_text} {text_input}".strip()

    payload = {"inputs": final_input}
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    response = requests.post(
        "https://api-inference.huggingface.co/models/google/flan-t5-small",
        headers=headers,
        json=payload
    )

    try:
        output_text = response.json()[0]["generated_text"]
    except Exception:
        output_text = "⚠️ Model error or API limit reached."

    alert_triggered = any(word.lower() in output_text.lower() for word in ALERT_KEYWORDS)
    alert_message = "🚨 ALERT: Distress keyword detected!" if alert_triggered else "✅ No distress detected."

    return transcribed_text, output_text, alert_message

def main():
    with gr.Blocks() as demo:
        gr.Markdown("## 🔊 Voice + Text Distress Detection (Sarvam AI)")

        with gr.Row():
            audio_input = gr.Audio(type="filepath", label="🎙️ Speak or Upload Audio", interactive=True)
            text_input = gr.Textbox(label="💬 Or type something")

        transcribed = gr.Textbox(label="📝 Transcribed Audio")
        output_text = gr.Textbox(label="🤖 Model Output")
        alert_status = gr.Textbox(label="⚠️ Alert Status")

        run_button = gr.Button("Submit")
        run_button.click(
            fn=process_input,
            inputs=[audio_input, text_input],
            outputs=[transcribed, output_text, alert_status]
        )

    demo.launch()

if __name__ == "__main__":
    main()
