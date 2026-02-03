# Use an official Python runtime as a parent image
FROM python:3.11

# Handles specifying the working directory within the container
WORKDIR /code

# Install required dependencies
COPY pyreqs.txt .
RUN pip install --no-cache-dir -r pyreqs.txt && rm pyreqs.txt

# Copy the local files to the container
COPY . .

# Configure the Flask application to listen on port 8080
EXPOSE 5000

# Start Gunicorn with 4 worker processes
CMD ["gunicorn", "-c", "./gunicorn_config.py", "api:app"]

