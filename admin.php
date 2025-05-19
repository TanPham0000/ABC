<?php
$dataFile = 'data.json';
$items = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];
?>

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Carousel Admin (PHP)</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>📸 Upload Carousel Item</h1>
  <form action="save.php" method="POST" enctype="multipart/form-data">
    <label>Cover Image: <input type="file" name="image" required></label><br>
    <label>Link: <input type="url" name="link" required></label><br>
    <label>Description: <textarea name="desc" required></textarea></label><br>
    <button type="submit">➕ Upload</button>
  </form>

  <h2>📂 Existing Items</h2>
  <?php if (empty($items)): ?>
    <p>No items yet.</p>
  <?php else: ?>
    <?php foreach ($items as $index => $item): ?>
      <div class="entry">
        <img src="<?= $item['image'] ?>" width="100"><br>
        <strong>Link:</strong> <a href="<?= $item['link'] ?>" target="_blank"><?= $item['link'] ?></a><br>
        <strong>Description:</strong> <?= htmlspecialchars($item['desc']) ?><br>
        <form action="delete.php" method="POST" style="margin-top:5px;">
          <input type="hidden" name="index" value="<?= $index ?>">
          <button type="submit">🗑️ Delete</button>
        </form>
      </div>
    <?php endforeach; ?>
  <?php endif; ?>
</body>
</html>
