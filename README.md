# Log Observer
> Log monitoring and alerting nodeJS service.

## Description
This service is used for observing any kind of files from filesystem or web pages and when some specified change occurs
to the observed files, an alert is being sent to the specified channel/s. Supported alerting channels are following:
* Stdout
* File
* Slack
* Email
* Websocket (in development)

Example use-case is observing the ssh logs in order to be alerted about unwanted login attempts to specific server.

## Installation
Clone this repository from master branch:

```sh
git clone https://github.com/Lujo5/log-observer
```

And just run the main.js from src folder using node or pm2:

```sh
node src/main.js

pm2 start src/main.js --name log-observer
```

## Configuration
Configuration file is locatedg in folder `resources` and must be named `config.json`.
Example configuration:

```json
{
  "meta": {
    "name": "Name-PC"
  },
  "files": [
    {
      "path": "../sample/auth.log",
      "encoding": "utf-8",
      "patterns": {
        "login_success": {
          "description": "Successful login via SSH",
          "pattern": "Accepted password for ([^\\s]+) from ([^\\s]+)",
          "show_group": 0,
          "case_sensitive": false,
          "change_only": false
        },
        "login_failed": {
          "description": "Failed login via SSH",
          "pattern": "Failed password for ([^\\s]+) from ([^\\s]+)",
          "show_group": 0,
          "case_sensitive": false,
          "change_only": true
        }
      },
      "notifiers": {
        "stdout": true,
        "file": {
          "path": "../sample/observed.txt",
          "encoding": "utf-8",
          "separator": "\r\n"
        },
        "webhook": {
          "urls": [
            "https://hooks.slack.com/services/key/hash"
          ]
        },
        "email": {
          "subject": "[{{name}}] Observer alert - {{event}}",
          "from": "alert@domain.com",
          "to": [
            "name@domain.com"
          ],
          "conf": {
            "host": "smtp.server.com",
            "port": 465,
            "secure": true,
            "auth": {
              "user": "alert@domain.com",
              "pass": "yourPassword"
            },
            "tls": {
              "rejectUnauthorized": false
            }
          }
        },
        "websocket": {
          "url": "domain.com/websocket"
        }
      }
    }
  ],
  "web_pages": [
    {
      "url": "https://www.google.com",
      "cron": "0 */5 9-17 * * 1-5",
      "patterns": {
        "web_value_changed": {
          "description": "Web value changed",
          "pattern": "<span>([^\\s]+)</span>",
          "show_group": 1,
          "case_sensitive": false,
          "change_only": true
        }
      },
      "notifiers": {
        "stdout": true,
        "file": {
          "path": "../sample/observed.txt",
          "encoding": "utf-8",
          "separator": "\r\n"
        }
      }
    }
  ]
}
```

License
----

MIT