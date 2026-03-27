$exclude = @('node_modules','.git','.next','.expo','dist','build','coverage','.turbo')
$maxDepth = 4

function Show-Tree($path, $prefix, $depth){
  if($depth -gt $maxDepth){ return }

  $items = Get-ChildItem -LiteralPath $path -Force -ErrorAction SilentlyContinue |
           Where-Object { $exclude -notcontains $_.Name }

  for($i=0; $i -lt $items.Count; $i++){
    $item = $items[$i]
    $isLast = ($i -eq $items.Count-1)
    $connector = if($isLast){ '\-- ' } else { '|-- ' }
    Write-Output ($prefix + $connector + $item.Name)

    if($item.PSIsContainer){
      $newPrefix = $prefix + (if($isLast){ '    ' } else { '|   ' })
      Show-Tree $item.FullName $newPrefix ($depth + 1)
    }
  }
}

Show-Tree (Get-Location).Path '' 1