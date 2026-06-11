$headers = @{ "Authorization" = "cnEoDAcooSQwecdoxetAxYtRw5TLzFNUmcxbKzQHeaN59xYxsisshwNV" }

$queries = @(
    @{ id = "m1"; query = "braised pork rice" },
    @{ id = "m2"; query = "braised pork rice large" },
    @{ id = "m3"; query = "meatball soup taiwanese" },
    @{ id = "m4"; query = "steamed vegetables" },
    @{ id = "m5"; query = "fried egg" },
    @{ id = "m6"; query = "beef noodle soup" },
    @{ id = "m7"; query = "clear beef noodle soup" },
    @{ id = "m8"; query = "dry noodles sesame" },
    @{ id = "m9"; query = "braised pork platter" },
    @{ id = "m10"; query = "fried chicken cutlet" },
    @{ id = "m11"; query = "fried chicken wings" },
    @{ id = "m12"; query = "french fries" },
    @{ id = "m13"; query = "sweet potato balls fried" },
    @{ id = "m14"; query = "seafood congee" },
    @{ id = "m15"; query = "milkfish congee" },
    @{ id = "m16"; query = "century egg pork congee" },
    @{ id = "m17"; query = "fried bread stick youtiao" },
    @{ id = "m18"; query = "takoyaki" },
    @{ id = "m19"; query = "takoyaki japanese" },
    @{ id = "m20"; query = "japanese yakisoba" },
    @{ id = "m21"; query = "margherita pizza" },
    @{ id = "m22"; query = "seafood pizza" },
    @{ id = "m23"; query = "hawaiian pizza" },
    @{ id = "m24"; query = "roasted chicken wings" },
    @{ id = "m25"; query = "vietnamese baguette banh mi" },
    @{ id = "m26"; query = "vietnamese pho" },
    @{ id = "m27"; query = "fresh spring rolls" },
    @{ id = "m28"; query = "strawberry cake" },
    @{ id = "m29"; query = "chocolate cake slice" },
    @{ id = "m30"; query = "cheesecake" },
    @{ id = "m31"; query = "macarons" },
    @{ id = "m32"; query = "grilled sausage taiwanese" },
    @{ id = "m33"; query = "sausage with garlic" },
    @{ id = "m34"; query = "grilled corn butter" },
    @{ id = "m35"; query = "caesar salad" },
    @{ id = "m36"; query = "chicken breast salad" },
    @{ id = "m37"; query = "tuna salad" },
    @{ id = "m38"; query = "stinky tofu spicy" },
    @{ id = "m39"; query = "stinky tofu soup" },
    @{ id = "m40"; query = "stinky tofu kimchi" },
    @{ id = "m41"; query = "tonkotsu ramen" },
    @{ id = "m42"; query = "miso ramen" },
    @{ id = "m43"; query = "chashu ramen" },
    @{ id = "m44"; query = "pan fried gyoza" },
    @{ id = "m45"; query = "thai basil pork rice" },
    @{ id = "m46"; query = "thai curry" },
    @{ id = "m47"; query = "green papaya salad" },
    @{ id = "m48"; query = "eggs benedict" },
    @{ id = "m49"; query = "pancakes with cream" },
    @{ id = "m50"; query = "omelette" },
    @{ id = "m51"; query = "bubble tea" },
    @{ id = "m52"; query = "bubble tea pearls" },
    @{ id = "m53"; query = "matcha latte" },
    @{ id = "m54"; query = "fruit tea" },
    @{ id = "m55"; query = "pineapple bun" },
    @{ id = "m56"; query = "hong kong milk tea" },
    @{ id = "m57"; query = "french toast" },
    @{ id = "m58"; query = "char siu rice hong kong" },
    @{ id = "m59"; query = "korean fried chicken" },
    @{ id = "m60"; query = "spicy fried chicken gochujang" },
    @{ id = "m61"; query = "rice cake skewer tteokbokki" }
)

$results = @{}

foreach ($item in $queries) {
    $q = [uri]::EscapeDataString($item.query)
    $uri = "https://api.pexels.com/v1/search?query=$q&per_page=1&orientation=square"
    try {
        $resp = Invoke-RestMethod -Uri $uri -Headers $headers
        if ($resp.photos.Count -gt 0) {
            $results[$item.id] = $resp.photos[0].src.medium
            Write-Host "$($item.id) -> OK: $($resp.photos[0].alt)"
        } else {
            $results[$item.id] = $null
            Write-Host "$($item.id) -> NO RESULTS"
        }
    } catch {
        $results[$item.id] = $null
        Write-Host "$($item.id) -> ERROR: $_"
    }
    Start-Sleep -Milliseconds 500
}

Write-Host "`n=== RESULTS ==="
foreach ($kvp in $results.GetEnumerator()) {
    Write-Host "$($kvp.Key) = $($kvp.Value)"
}
