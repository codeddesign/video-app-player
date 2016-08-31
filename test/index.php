<?php
require 'browser.php';

if (isset($_GET['c'])) {
    $tagId = trim($_GET['c']);

    $tags = require 'tags.php';
    if (!isset($tags[$tagId])) {
        exit('This page is not available');
    }

    $campaign = !isset($_GET['l']) ? 22 : 1;
    if (stripos($tagId, 'stream') !== false) {
        $campaign = !isset($_GET['l']) ? 269 : 2;
        $isStream = '';
    }

    $tag = $tags[$tagId];

    $tagUrl = $tag['desktop'];
    if (browserIs('mobile')) {
        if (!isset($tag['mobile'])) {
            exit('There\'s not mobile tag for this demo.');
        }

        $tagUrl = $tag['mobile'];
    }
}
?>
<!DOCTYPE html>
<html>

<head>
    <title></title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>

<body>
    <style>div.container { padding-top: 30px }</style>

    <div class="container forForm">
        <div class="col-md-8 col-md-push-2">
            <div class="row <?= isset($campaign) ? 'hidden' : ''; ?>">
                <form style="margin: 20px;" id="testForm">
                    <div class="form-group">
                        <input class="form-control" placeholder="Campaign ID" id="campaign"
                        required
                        value="<?= isset($campaign) ? $campaign : ''; ?>"
                        >
                    </div>

                    <div class="form-group">
                        <input class="form-control" placeholder="TAG Url" id="tag"
                        value="<?= isset($tagUrl) ? $tagUrl : ''; ?>"
                        >
                    </div>

                    <div class="text-right">
                        <button type="submit" class="btn btn-default" id="go">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="container forText">
    <?php if (isset($isStream) || isset($_GET['l'])) {
    for ($i = 0;$i < 20;++$i) {
        ?>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <?php
    }
}?>
    </div>

    <div class="container forAd" style="padding: 0;">
        <div class="col-md-8 col-md-push-2">
            <div class="row" id="test">
                <script type="text/javascript" id="test"></script>
            </div>

            <div class="row" id="progress"></div>
        </div>
    </div>

    <div class="container forText">
    <?php if (isset($isStream) || 1 == 1) {
    for ($i = 0;$i < 15;++$i) {
        ?>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <?php
    }
}?>
    </div>

    <script type="text/javascript">
        var TESTING = {
            campaign: false,
            tag: false
        };

        (function() {
            var $form = document.querySelector('#testForm'),
                $test = document.querySelector('#test'),
                script;

            function preview() {
                // fetch values
                TESTING.campaign = document.querySelector('#campaign').value;
                TESTING.tag = document.querySelector('#tag').value;

                // clean test container
                $test.innerHTML = '';

                // create script
                script = document.createElement('script');
                script.src = document.location.protocol + '//'
                    + document.location.host
                    + '/p' + TESTING.campaign + '.js?ts=' + Date.now();

                $test.appendChild(script);
            }

            $form.addEventListener('submit', function(ev) {
                ev.preventDefault();

                preview();
            });

            <?= (isset($campaign)) ? 'preview()' : ''; ?>
        })();
    </script>
</body>

</html>
