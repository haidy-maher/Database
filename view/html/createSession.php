<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <!-- CSS LINK -->
    <link rel="stylesheet" href="../css/layout.css">
    <link rel="stylesheet" href="../css/create-edit.css">
  
     <!-- Font awesome -->
     <script src="https://kit.fontawesome.com/6b11d4a153.js" crossorigin="anonymous"></script>
     <!-- Font -->
     <!-- FONT 1 -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Grandiflora+One&family=Rethink+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&family=Silkscreen&display=swap" rel="stylesheet">
</head>
<body>

<?php include "components/dashboardNav.php" ?>


<!-- Main -->
<div class="main">
<div class="header">
  <div class="title"><h3>Create Sessions</h3></div>
  
</div>
<div class="content">

<form action="post">
  <div class="form-group">
    <label for="name">Topic Name</label>
    <input type="text" id="name" name="name">
  </div>
  
  <div class="form-group">
    <label for="email">Date</label>
    <input type="Date" id="email" name="email">
  </div>
  
  <button type="submit">Create</button>
</form>



</div>

</div>

</body>
</html>