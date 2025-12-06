<?php
include '../conn.php';

$maxLimit = 10;

$query = "SELECT * FROM total_products WHERE is_deleted IS NULL AND is_active = 1 LIMIT $maxLimit;";
$query_run = mysqli_query($conn, $query);

if (mysqli_num_rows($query_run) > 0) {
  while ($row = mysqli_fetch_assoc($query_run)) {
    echo "<tr>
            <td scope='row'><img src='" . $row['image'] . "' alt='' style='max-width:60px;'></td>
            <td class='product-name'><a href='#'>" . $row['name'] . "</a></td>
            <td><p>" . $row['brand'] . "</p></td>
            <td><p>" . $row['category'] . "</p></td>
            <td><p>$" . $row['price'] . "</p></td>
            <td><p>" . $row['stock'] . "</p></td>
            <td><p class='color'>" . $row['color'] . "</p></td>
          </tr>";
  }
} else {
  echo "<tr><td colspan='7'>No Record Found</td></tr>";
}
