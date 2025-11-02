# Weathered - Weather Data Visualization & Prediction Platform
A serverless data visualization application that displays weather predictions for London and performs sentiment analysis on weather-related news.

## Overview
Weathered is a full-stack web application built using AWS serverless architecture to predict and visualize five key weather features in London:

 - Temperature
 - Precipitation
 - Relative Humidity
 - Wind Speed
 - Wind Direction

The platform also performs sentiment analysis on weather-related news articles and displays synthetic data predictions for students.
## Tech Stack
### Frontend:
 - HTML5 & CSS3
 - TypeScript
 - Plotly.js (data visualization)
 - Axios (API requests)

### Backend & Cloud Services:
 - AWS Lambda (serverless functions)
 - AWS SageMaker (machine learning predictions)
 - AWS DynamoDB (NoSQL database)
 - AWS S3 (static hosting)
 - AWS API Gateway

### APIs:
 - Open Meteo Historical Weather API
 - News API (sentiment analysis)



## Architecture
The application follows a serverless architecture pattern:

 - User Interface → connects via WebSockets to AWS API Gateway
 - API Gateway → triggers Lambda functions
 - Lambda Functions → query DynamoDB and invoke SageMaker endpoints
 - SageMaker → generates ML predictions
 - DynamoDB → stores historical and predicted weather data
 - S3 → hosts static website files

## Features
 - Interactive Data Visualization: Select weather features via radio buttons to view corresponding charts
 - Real-time Predictions: Machine learning-powered weather forecasting using AWS SageMaker
 - Sentiment Analysis: Analyzes weather-related news articles and displays sentiment distribution
 - Synthetic Data Support: Displays predictions for student synthetic data
 - Responsive Design: Clean, user-friendly interface optimized for various devices

## Data Visualization
The application uses Plotly.js to create:

 - Line charts for weather predictions over time
 - Pie charts for sentiment analysis results
 - Interactive tooltips for detailed data inspection
 - Multi-series comparison (existing data vs. predictions)

## AWS Services Configuration

 - Lambda Functions: Event-triggered serverless computing
 - DynamoDB Tables: Store weather data with partition keys for efficient querying
 - SageMaker Endpoints: Deploy trained ML models for real-time predictions
 - API Gateway: RESTful API endpoints for frontend-backend communication
 - CloudWatch: Monitoring and logging


## Academic Project
This project was completed as part of coursework at Middlesex University (April 2024).
