<?php
require 'browser.php';

if (isset($_GET['c'])) {
    $tagId = trim($_GET['c']);

    $tags = require 'tags.php';
    if (!isset($tags[$tagId])) {
        exit('This page is not available');
    }

    $campaign = 22;
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
    <div class="container">
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
                        <button type="submit" class="btn btn-default">Submit</button>
                    </div>
                </form>
            </div>

            <div class="row" id="test">
                <script type="text/javascript" id="test"></script>
            </div>
        </div>
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
                    + '/p' + TESTING.campaign + '.js';

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
