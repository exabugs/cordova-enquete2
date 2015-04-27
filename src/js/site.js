/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var chiwawa = "https://demo.chiwawa.jp";
//var chiwawa = "http://192.168.11.4:8004";

var TOKEN_KEY = "access_token";

var site = {

  logout: function () {
    if (localStorage.getItem(TOKEN_KEY)) {
      this.ajax("logout", function() {
        localStorage.removeItem(TOKEN_KEY);
      });
    }
    $("#logs").append("<p class='success'><b>logout: </b>" + "</p>");
  },

  login: function (callback) {
    // todo: アプリ内で設定変更できるように
    var params = {
      url: chiwawa + "/oauth2/",
      client_id: "cordovaHello",
      client_secret: "chiwawaapp..secret",
      redirect_uri: "http://chiwawa.jp/auth/callback/"
    };
    var oauthParams = {
      response_type: "code",               // required - "code"/"token"
      auth_url: params.url + "authorize",  // required
      token_url: params.url + "token",     // required if response_type = "code"
      client_id: params.client_id,         // required
      client_secret: params.client_secret, // required if response_type = "code"
      redirect_uri: params.redirect_uri    // required - some dummy url
      // other_params: {}        // optional params object for scope, state, display...
      // logout_url: "",         // recommended if available
    };
    $.oauth2(oauthParams,
      function (token) {
        // do something with token or response
        $("#logs").append("<p class='success'><b>access_token: </b>" + token + "</p>");
        localStorage.setItem(TOKEN_KEY, token);
        callback && callback(null, token);
      },
      function (err) {
        // do something with err object
        $("#logs").append("<p class='error'><b>error: </b>" + JSON.stringify(err) + "</p>");
        localStorage.removeItem(TOKEN_KEY);
        callback && callback(err);
      }
    );
  },

  ajax: function (path, params, callback) {
    var self = this;
    if (typeof params === 'function') {
      callback = params;
      params = undefined;
    }
    params = params || {};
    async.waterfall(
      [
        function (next) {
          var token = localStorage.getItem(TOKEN_KEY);
          if (token) {
            next(null, token);
          } else {
            self.login(next);
          }
        },
        function (token, next) {
          $.ajax({
            headers: {
              'Authorization': "Bearer " + token
            },
            url: [chiwawa, path].join('/'),
            data: params.data,
            type: params.type || "GET",
            success: function (data) {
              next(null, data);
            },
            error: function (err) {
              next(err);
            }
          });
        }
      ],
      function (err, data) {
        callback && callback(err, data);
      }
    );
  }

};
