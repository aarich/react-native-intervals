<!DOCTYPE html>
<html lang="%LANG_ISO_CODE%">
  <head>
    <meta charset="utf-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <!-- 
      This viewport works for phones with notches.
      It's optimized for gestures by disabling global zoom.
     -->
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1.00001, viewport-fit=cover"
    />

    <!-- Custom Content -->

    <?php
      $host = 'https://projects.mrarich.com%WEB_PUBLIC_URL%';
      $url = $host;
      $bannerUrl = $host . '/banner.png';
      $description = 'Highly Customizable Timers'; 
      $title = '%WEB_TITLE%';

      $appArg = '';

      if (isset($_GET["f"])) {
        // We can set some things
        $flowParam = $_GET["f"];
        $flow = json_decode($flowParam);
        $title = $flow->n;
        $description = $flow->d;
        $appArg = ', app-argument=intervals://?f='.htmlspecialchars($flowParam);
      }
    ?>

    <meta name="title" content="<?php echo $title; ?>" />
    <meta name="description" content="<?php echo $description; ?>" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="<?php echo $title; ?>" />
    <meta property="og:description" content="<?php echo $description; ?>" />
    <meta property="og:image" content="<?php echo $bannerUrl; ?>" />

    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="<?php echo $url ?>" />
    <meta property="twitter:title" content="<?php echo $title; ?>" />
    <meta property="twitter:description" content="<?php echo $description; ?>" />
    <meta property="twitter:image" content="<?php echo $bannerUrl; ?>" />

    <meta
      name="apple-itunes-app"
      content="app-id=1552160706<?php echo $appArg; ?>"
    />

    <title><?php echo $title; ?></title>
    
    <!-- End Custom Content --> 

    <style>
      /**
       * Extend the react-native-web reset:
       * https://github.com/necolas/react-native-web/blob/master/packages/react-native-web/src/exports/StyleSheet/initialRules.js
       */
      html,
      body,
      #root {
        width: 100%;
        /* To smooth any scrolling behavior */
        -webkit-overflow-scrolling: touch;
        margin: 0px;
        padding: 0px;
        /* Allows content to fill the viewport and go beyond the bottom */
        min-height: 100%;
      }
      #root {
        flex-shrink: 0;
        flex-basis: auto;
        flex-grow: 1;
        display: flex;
        flex: 1;
      }

      html {
        scroll-behavior: smooth;
        /* Prevent text size change on orientation change https://gist.github.com/tfausak/2222823#file-ios-8-web-app-html-L138 */
        -webkit-text-size-adjust: 100%;
        height: calc(100% + env(safe-area-inset-top));
      }

      body {
        display: flex;
        /* Allows you to scroll below the viewport; default value is visible */
        overflow-y: auto;
        overscroll-behavior-y: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -ms-overflow-style: scrollbar;
      }
      /* Enable for apps that support dark-theme */
      /*@media (prefers-color-scheme: dark) {
        body {
          background-color: black;
        }
      }*/
    </style>
  </head>

  <body>
    <!-- 
      A generic no script element with a reload button and a message.
      Feel free to customize this however you'd like.
    -->
    <noscript>
      <form
        action=""
        style="
          background-color: #fff;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
        "
      >
        <div
          style="
            font-size: 18px;
            font-family: Helvetica, sans-serif;
            line-height: 24px;
            margin: 10%;
            width: 80%;
          "
        >
          <p>Oh no! It looks like JavaScript is not enabled in your browser.</p>
          <p style="margin: 20px 0">
            <button
              type="submit"
              style="
                background-color: #4630eb;
                border-radius: 100px;
                border: none;
                box-shadow: none;
                color: #fff;
                cursor: pointer;
                font-weight: bold;
                line-height: 20px;
                padding: 6px 16px;
              "
            >
              Reload
            </button>
          </p>
        </div>
      </form>
    </noscript>
    <!-- The root element for your Expo app. -->
    <div id="root"></div>
  </body>
</html>
