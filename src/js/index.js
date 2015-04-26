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

//var chiwawa = "https://demo.chiwawa.jp";
var chiwawa = "http://192.168.11.4:8004";


var TOKEN_KEY = "access_token";

var app = {

  // Application Constructor
  initialize: function () {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function () {
    $(document).on("deviceready", this.onDeviceReady);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function () {
    console.log("onDeviceReady");

    app.receivedEvent("deviceready");
  },

  logout: function () {
    if (localStorage.getItem(TOKEN_KEY)) {
      app.ajax({url: '/logout'});
      localStorage.removeItem(TOKEN_KEY);
    }
    $("#logs").append("<p class='success'><b>logout: </b>" + "</p>");
  },

  login: function () {
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
      function (token, response) {
        // do something with token or response
        $("#logs").append("<p class='success'><b>access_token: </b>" + token + "</p>");
        localStorage.setItem(TOKEN_KEY, token);
      },
      function (err, response) {
        // do something with err object
        $("#logs").append("<p class='error'><b>error: </b>" + JSON.stringify(err) + "</p>");
        localStorage.removeItem(TOKEN_KEY);
      }
    );
  },

  getUser: function () {
    app.ajax({
      url: '/oauth2/token',
      success: function (data) {
        $("#logs").append("<p class='success'><b>response: </b>" + JSON.stringify(data) + "</p>");
      },
      error: function (error) {
        $("#logs").append("<p class='error'><b>response: </b>" + JSON.stringify(error) + "</p>");
      }
    });
  },

  ajax: function (params) {
    var token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      app.login();
    } else {
      $.ajax({
        headers: {
          'Authorization': "Bearer " + token
        },
        url: chiwawa + params.url,
        data: params.data,
        type: params.type || 'GET',
        success: function (data) {
          params.success(data);
        },
        error: function (err) {
          params.error(err);
        }
      });
    }
  },

  // Update DOM on a Received Event
  receivedEvent: function (id) {
    //var parentElement = document.getElementById(id);
    //var listeningElement = parentElement.querySelector(".listening");
    //var receivedElement = parentElement.querySelector(".received");
    //listeningElement.setAttribute("style", "display:none;");
    //receivedElement.setAttribute("style", "display:block;");

    if (device) {
      $.each(document.querySelectorAll("td.device"), function () {
        $(this).text(device[this.id]);
      });
    }

    console.log("Received Event: " + id);
  }
};

app.initialize();