<?php
$dataFile = 'data.json';
$uploadsDir = 'uploads/';

if (!file_exists($uploadsDir)) {
  mkdir($uploadsDir, 0755, true);
}

if (isset($_FILES['image']) && isset($_POST['link']) && isset($_POST['desc'])) {
  $file = $_FILES['image'];
  $desc = $_POST['desc'];
  $link = $_POST['link'];

  if ($file['error'] === UPLOAD_ERR_OK) {
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $fileName = uniqid() . '.' . $ext;
    $filePath = $uploadsDir . $fileName;

    if (move_uploaded_file($file['tmp_name'], $filePath)) {
      $newItem = [
        'image' => $filePath,
        'link' => $link,
        'desc' => $desc,
      ];

      $items = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];
      array_unshift($items, $newItem);
      $items = array_slice($items, 0, 10); // Keep only latest 10
      file_put_contents($dataFile, json_encode($items, JSON_PRETTY_PRINT));

      header("Location: admin.php");
      exit();
    }
  }
}

echo "Upload failed.";
