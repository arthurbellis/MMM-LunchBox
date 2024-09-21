# MMM-LunchBox

Pull menus via cron:

```
# pull latest menu from ASIJ cafe
0 10 * * 0 curl 'https://asij.lunchboxsystems.com/publishedmenu/1' -s -o /home/pi/MagicMirror/modules/MMM-LunchBox/menus/latest.html
```

