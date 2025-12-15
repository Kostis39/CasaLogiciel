import multiprocessing

# Server socket
bind = "0.0.0.0:5000"

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
backlog = 2048

# Timeouts (increase if queries legitimately take long)
timeout = 120  # 2 minutes - increase if needed
keepalive = 5

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Performance
max_requests = 1000
max_requests_jitter = 50