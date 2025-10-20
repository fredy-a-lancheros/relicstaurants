# Backend Services Configuration

## 🔐 Environment Variables Setup

All three backend services use New Relic APM for monitoring and require environment variables for configuration.

## 📝 Services

- **Restaurant Service** (port 3001)
- **Checkout Service** (port 3002)
- **Menu Service** (port 3003)

## 🚀 Setup Instructions

### For Each Service:

1. **Navigate to the service directory:**
   ```bash
   cd restaurantService  # or menuService or checkoutService
   ```

2. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` with your New Relic credentials:**
   ```env
   NEW_RELIC_APP_NAME=Foodme->restaurantService
   NEW_RELIC_LICENSE_KEY=your_actual_license_key
   NEW_RELIC_LOG_LEVEL=info
   NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Start the service:**
   ```bash
   node start.js
   ```

## 🔑 Required Environment Variables

### All Services Need:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEW_RELIC_APP_NAME` | Application name in New Relic | `Foodme->restaurantService` |
| `NEW_RELIC_LICENSE_KEY` | Your New Relic license key | `NRJS-xxxxx` |
| `NEW_RELIC_LOG_LEVEL` | Log level (trace, debug, info, warn, error) | `info` |
| `NEW_RELIC_DISTRIBUTED_TRACING_ENABLED` | Enable distributed tracing | `true` |

### How to Get Your New Relic License Key:

1. Go to [New Relic One](https://one.newrelic.com/)
2. Click your profile → **API keys**
3. Copy your **License key** (starts with `NRJS-` or similar)

## ⚠️ Security Notes

- ✅ `.env` files are already in `.gitignore` and **will not be committed**
- ✅ Never commit real credentials to GitHub
- ✅ Use `.env.example` as a template for other developers
- ✅ Each service has its own `.env` file

## 🏗️ For Railway/Production Deployment

Set these environment variables in each Railway service:

- `NEW_RELIC_APP_NAME`
- `NEW_RELIC_LICENSE_KEY`
- `NEW_RELIC_LOG_LEVEL`
- `NEW_RELIC_DISTRIBUTED_TRACING_ENABLED`

Railway will inject them automatically when each service starts.

## 🧪 Testing

To verify services are running correctly:

```bash
# From project root
./test-services.ps1
```

Or manually test each endpoint:

```bash
# Restaurant Service
curl http://localhost:3001/api/restaurants

# Menu Service
curl http://localhost:3003/api/menu/esthers

# Checkout Service
curl -X POST http://localhost:3002/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"items":[{"name":"Test","price":9.99,"count":1}]}'
```

## 🔗 Distributed Tracing

With `NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true`, you can:
- Track requests across all microservices
- See the complete journey from frontend → backend → backend
- Identify bottlenecks and slow services
- Debug errors across service boundaries

## 📊 New Relic Dashboard

Once running, check your services in New Relic One:
1. Go to **APM & Services**
2. You should see:
   - `Foodme->restaurantService`
   - `Foodme->menuService`
   - `Foodme->checkoutService`
3. Click any service to see metrics, traces, and errors
