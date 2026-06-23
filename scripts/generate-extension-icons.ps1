$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

function New-RoundedRectPath {
  param(
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [float]$Radius
  )

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $Radius * 2

  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()

  return $path
}

function Write-Icon {
  param(
    [int]$Size,
    [string]$OutputPath
  )

  $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.Color]::Transparent)

  $blue = [System.Drawing.ColorTranslator]::FromHtml('#2563EB')
  $white = [System.Drawing.Color]::White

  $cardRadius = [Math]::Round($Size * 0.22)
  $cardPath = New-RoundedRectPath -X ($Size * 0.08) -Y ($Size * 0.08) -Width ($Size * 0.84) -Height ($Size * 0.84) -Radius $cardRadius
  $cardBrush = New-Object System.Drawing.SolidBrush($blue)
  $graphics.FillPath($cardBrush, $cardPath)

  $stroke = [Math]::Max(1.8, $Size * 0.085)
  $pen = New-Object System.Drawing.Pen($white, $stroke)
  $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

  $backX = $Size * 0.28
  $backY = $Size * 0.22
  $backW = $Size * 0.30
  $backH = $Size * 0.34
  $backR = $Size * 0.07
  $backPath = New-RoundedRectPath -X $backX -Y $backY -Width $backW -Height $backH -Radius $backR
  $graphics.DrawPath($pen, $backPath)

  $frontX = $Size * 0.40
  $frontY = $Size * 0.36
  $frontW = $Size * 0.30
  $frontH = $Size * 0.34
  $frontR = $Size * 0.07
  $frontPath = New-RoundedRectPath -X $frontX -Y $frontY -Width $frontW -Height $frontH -Radius $frontR
  $graphics.DrawPath($pen, $frontPath)

  $graphics.Save()
  $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)

  $frontPath.Dispose()
  $backPath.Dispose()
  $pen.Dispose()
  $cardBrush.Dispose()
  $cardPath.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

$publicDir = Join-Path $PSScriptRoot '..\public'

Write-Icon -Size 16 -OutputPath (Join-Path $publicDir 'copybox16.png')
Write-Icon -Size 48 -OutputPath (Join-Path $publicDir 'copybox48.png')
Write-Icon -Size 128 -OutputPath (Join-Path $publicDir 'copybox128.png')
