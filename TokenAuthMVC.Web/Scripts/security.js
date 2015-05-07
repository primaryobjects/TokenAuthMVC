/* Token-based authentication for ASP .NET MVC REST web services.
   Copyright (c) 2015 Kory Becker
   http://primaryobjects.com/kory-becker
   License MIT
*/
var SecurityManager = {
    salt: 'rz8LuOtFBXphj9WQfvFh',
    username: localStorage['SecurityManager.username'],
    key: localStorage['SecurityManager.key'],
    ip: null,

    generate: function (username, password) {
        // Generates a token to be used for API calls. The first time during authentication, pass in a username/password. All subsequent calls can simply omit username and password, as the same token key (hashed password) will be used.
        if (username && password) {
            // If the user is providing credentials, then create a new key.
            SecurityManager.logout();
        }

        // Set the username.
        SecurityManager.username = SecurityManager.username || username;

        // Set the key to a hash of the user's password + salt.
        SecurityManager.key = SecurityManager.key || CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256([password, SecurityManager.salt].join(':'), SecurityManager.salt));

        // Set the client IP address.
        SecurityManager.ip = SecurityManager.ip || SecurityManager.getIp();

        // Persist key pieces.
        if (SecurityManager.username) {
            localStorage['SecurityManager.username'] = SecurityManager.username;
            localStorage['SecurityManager.key'] = SecurityManager.key;
        }

        // Get the (C# compatible) ticks to use as a timestamp. http://stackoverflow.com/a/7968483/2596404
        var ticks = ((new Date().getTime() * 10000) + 621355968000000000);

        // Construct the hash body by concatenating the username, ip, and userAgent.
        var message = [SecurityManager.username, SecurityManager.ip, navigator.userAgent, ticks].join(':');

        // Hash the body, using the key.
        var hash = CryptoJS.HmacSHA256(message, SecurityManager.key);

        // Base64-encode the hash to get the resulting token.
        var token = CryptoJS.enc.Base64.stringify(hash);

        // Include the username and timestamp on the end of the token, so the server can validate.
        var tokenId = [SecurityManager.username, ticks].join(':');

        // Base64-encode the final resulting token.
        var tokenStr = CryptoJS.enc.Utf8.parse([token, tokenId].join(':'));

        return CryptoJS.enc.Base64.stringify(tokenStr);
    },

    logout: function () {
        SecurityManager.ip = null;

        localStorage.removeItem('SecurityManager.username');
        SecurityManager.username = null;

        localStorage.removeItem('SecurityManager.key');
        SecurityManager.key = null;
    },

    getIp: function () {
        var result = '';

        $.ajax({
            url: '/ip',
            method: 'GET',
            async: false,
            success: function (ip) {
                result = ip;
            }
        });

        return result;
    }
};