<?php
$dataFile = 'data.json';
$uploadsDir = 'uploads/';

if (isset($_POST['index'])) {
  $items = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];
  $index = (int) $_POST['index'];

  if (isset($items[$index])) {
    $fileToDelete = $items[$index]['image'];
    if (file_exists($fileToDelete)) {
      unlink($fileToDelete);
    }

    array_splice($items, $index, 1);
    file_put_contents($dataFile, json_encode($items, JSON_PRETTY_PRINT));
  }

  header("Location: admin.php");
  exit();
}

echo "Delete failed.";
