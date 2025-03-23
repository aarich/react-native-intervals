import fs from 'fs';
import { updateAppJson } from './preBuildWeb.js';

const content = `
    <!-- Custom Content -->

    <?php
    $host = 'https://projects.mrarich.com/intervals';
    $url = $host;
    $bannerUrl = $host . '/banner.png';
    $description = 'Highly Customizable Timers';
    $title = 'Intervals';

    $appArg = '';

    if (isset($_GET['f'])) {
        // We can set some things
        $flowParam = $_GET['f'];
        $flow = json_decode($flowParam);
        $title = $flow->n;
        $description = $flow->d;
        $appArg = 'app-argument=intervals://?f=' . htmlspecialchars($flowParam);
    }
    ?>

    <meta name="title" content="<?php echo $title; ?>" />
    <meta name="description" content="<?php echo $description; ?>" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="<?php echo $title; ?>" />
    <meta property="og:description" content="<?php echo $description; ?>" />
    <meta property="og:image" content="<?php echo $bannerUrl; ?>" />

    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="<?php echo $url; ?>" />
    <meta property="twitter:title" content="<?php echo $title; ?>" />
    <meta
      property="twitter:description"
      content="<?php echo $description; ?>"
    />
    <meta property="twitter:image" content="<?php echo $bannerUrl; ?>" />

    <meta
      name="apple-itunes-app"
      content="app-id=1552160706<?php echo $appArg; ?>"
    />

    <!-- End Custom Content -->
`;

let indexContent = fs.readFileSync('dist/index.html').toString();

const headEndTagIndex = indexContent.indexOf('</head>');

indexContent =
  indexContent.slice(0, headEndTagIndex) +
  content +
  indexContent.slice(headEndTagIndex);

fs.writeFileSync('dist/index.php', indexContent);
fs.unlinkSync('dist/index.html');

updateAppJson((appJson) => {
  if (appJson.expo.experiments) {
    delete appJson.expo.experiments;
  } else {
    console.log('No experiments key found in app.json.');
  }
});
