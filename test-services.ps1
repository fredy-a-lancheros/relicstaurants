# Test Script for Relicstaurants Services
# Run this script to test all microservices locally

Write-Host "🧪 Testing Relicstaurants Microservices" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test Restaurant Service
Write-Host "📋 Testing Restaurant Service (port 3001)..." -ForegroundColor Yellow
try {
    $restaurants = Invoke-RestMethod -Uri "http://localhost:3001/api/restaurants" -Method Get
    Write-Host "✅ Restaurant Service OK - Found $($restaurants.Count) restaurants" -ForegroundColor Green
} catch {
    Write-Host "❌ Restaurant Service FAILED - Is it running on port 3001?" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test Menu Service with sample IDs
Write-Host "🍽️  Testing Menu Service (port 3003)..." -ForegroundColor Yellow
$testIds = @("esthers", "robatayaki", "satay", "curryup")
$menuSuccess = 0
foreach ($id in $testIds) {
    try {
        $menu = Invoke-RestMethod -Uri "http://localhost:3003/api/menu/$id" -Method Get
        if ($menu.menuItems -and $menu.menuItems.Count -gt 0) {
            Write-Host "  ✅ Menu for '$($menu.name)': $($menu.menuItems.Count) items" -ForegroundColor Green
            $menuSuccess++
        } else {
            Write-Host "  ⚠️  Menu for '$id': No menu items found" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ❌ Menu Service FAILED for '$id'" -ForegroundColor Red
    }
}
if ($menuSuccess -eq $testIds.Count) {
    Write-Host "✅ Menu Service OK - All test menus loaded" -ForegroundColor Green
} else {
    Write-Host "⚠️  Menu Service - Some menus failed" -ForegroundColor Yellow
}
Write-Host ""

# Test Checkout Service
Write-Host "🛒 Testing Checkout Service (port 3002)..." -ForegroundColor Yellow
try {
    $body = @{
        items = @(
            @{ name = "Test Item"; price = 9.99; count = 1 }
        )
    } | ConvertTo-Json
    
    $checkout = Invoke-RestMethod -Uri "http://localhost:3002/api/checkout" -Method Post -Body $body -ContentType "application/json"
    
    if ($checkout.orderId) {
        Write-Host "✅ Checkout Service OK - Order ID: $($checkout.orderId)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Checkout Service responded but no orderId" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Checkout Service FAILED - Is it running on port 3002?" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎯 Test Summary:" -ForegroundColor Cyan
Write-Host "   Restaurant Service: http://localhost:3001/api/restaurants"
Write-Host "   Menu Service: http://localhost:3003/api/menu/:id"
Write-Host "   Checkout Service: http://localhost:3002/api/checkout"
Write-Host ""
Write-Host "💡 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Start frontend: cd frontend && npm start"
Write-Host "   2. Open browser: http://localhost:3000"
Write-Host "   3. Test a restaurant page to see prices"
Write-Host ""
