from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import os
from typing import Optional
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ZedPulse Sentiment Analysis Service",
    description="Sentiment analysis microservice for political content",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load sentiment analysis model
MODEL_NAME = os.getenv("MODEL_NAME", "cardiffnlp/twitter-roberta-base-sentiment")
logger.info(f"Loading model: {MODEL_NAME}")

try:
    sentiment_analyzer = pipeline(
        "sentiment-analysis",
        model=MODEL_NAME,
        tokenizer=MODEL_NAME
    )
    logger.info("✅ Model loaded successfully")
except Exception as e:
    logger.error(f"❌ Error loading model: {e}")
    sentiment_analyzer = None

class TextInput(BaseModel):
    text: str

class SentimentOutput(BaseModel):
    label: str
    score: float
    confidence: float

@app.get("/")
async def root():
    return {
        "service": "ZedPulse Sentiment Analysis",
        "status": "running",
        "model": MODEL_NAME
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": sentiment_analyzer is not None
    }

@app.post("/analyze", response_model=SentimentOutput)
async def analyze_sentiment(input_data: TextInput):
    """
    Analyze sentiment of the provided text.
    
    Returns:
    - label: positive, negative, or neutral
    - score: sentiment score between -1 and 1
    - confidence: model confidence (0-1)
    """
    if not sentiment_analyzer:
        raise HTTPException(status_code=503, detail="Sentiment model not loaded")
    
    if not input_data.text or len(input_data.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        # Truncate text if too long (model limit is usually 512 tokens)
        text = input_data.text[:500]
        
        # Run sentiment analysis
        result = sentiment_analyzer(text)[0]
        
        # Map model output to our format
        label_map = {
            "POSITIVE": "positive",
            "NEGATIVE": "negative",
            "NEUTRAL": "neutral",
            "LABEL_0": "negative",
            "LABEL_1": "neutral",
            "LABEL_2": "positive"
        }
        
        raw_label = result["label"]
        confidence = result["score"]
        
        # Normalize label
        label = label_map.get(raw_label, "neutral")
        
        # Calculate score (-1 to 1)
        if label == "positive":
            score = confidence
        elif label == "negative":
            score = -confidence
        else:
            score = 0.0
        
        return SentimentOutput(
            label=label,
            score=round(score, 3),
            confidence=round(confidence, 3)
        )
        
    except Exception as e:
        logger.error(f"Error analyzing sentiment: {e}")
        raise HTTPException(status_code=500, detail=f"Error analyzing sentiment: {str(e)}")

@app.post("/batch-analyze")
async def batch_analyze_sentiment(texts: list[str]):
    """
    Analyze sentiment for multiple texts at once.
    """
    if not sentiment_analyzer:
        raise HTTPException(status_code=503, detail="Sentiment model not loaded")
    
    if not texts or len(texts) == 0:
        raise HTTPException(status_code=400, detail="Text list cannot be empty")
    
    try:
        results = []
        for text in texts[:100]:  # Limit to 100 texts
            if text and len(text.strip()) > 0:
                truncated_text = text[:500]
                result = sentiment_analyzer(truncated_text)[0]
                
                label_map = {
                    "POSITIVE": "positive",
                    "NEGATIVE": "negative",
                    "NEUTRAL": "neutral",
                    "LABEL_0": "negative",
                    "LABEL_1": "neutral",
                    "LABEL_2": "positive"
                }
                
                raw_label = result["label"]
                confidence = result["score"]
                label = label_map.get(raw_label, "neutral")
                
                if label == "positive":
                    score = confidence
                elif label == "negative":
                    score = -confidence
                else:
                    score = 0.0
                
                results.append({
                    "text": text[:100] + "..." if len(text) > 100 else text,
                    "label": label,
                    "score": round(score, 3),
                    "confidence": round(confidence, 3)
                })
        
        return {"results": results, "count": len(results)}
        
    except Exception as e:
        logger.error(f"Error in batch analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Error in batch analysis: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
