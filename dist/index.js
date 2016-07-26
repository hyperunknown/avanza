'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _Request = require('./Request');

var _Request2 = _interopRequireDefault(_Request);

var _Position = require('./Position');

var _Position2 = _interopRequireDefault(_Position);

var _Instrument = require('./Instrument');

var _Instrument2 = _interopRequireDefault(_Instrument);

var _Orderbook = require('./Orderbook');

var _Orderbook2 = _interopRequireDefault(_Orderbook);

var _nodeCache = require('node-cache');

var _nodeCache2 = _interopRequireDefault(_nodeCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Avanza = function () {
    function Avanza(options) {
        _classCallCheck(this, Avanza);

        if (options && options.storage) {
            this._storage = options.storage;
        } else {
            this._storage = new _nodeCache2.default({
                stdTTL: 120
            });
        }
    }

    _createClass(Avanza, [{
        key: 'getPositions',


        /**
         * Fetch all positions held by the current user
         */
        value: function getPositions() {

            var that = this;
            return new Promise(function (resolve, reject) {
                new _Request2.default({
                    path: '/_mobile/account/positions?sort=changeAsc',
                    method: 'GET',
                    headers: {
                        'X-AuthenticationSession': that.authenticationSession,
                        'X-SecurityToken': that.securityToken
                    }
                }).then(function (positions) {

                    var temp = [];
                    for (var i = 0; i < positions.instrumentPositions.length; i++) {
                        for (var j = 0; j < positions.instrumentPositions[i].positions.length; j++) {
                            temp.push(new _Position2.default(positions.instrumentPositions[i].positions[j]));
                        }
                    }
                    that._storage.set('positions', temp);
                    resolve(temp);
                }).catch(function (error) {
                    return reject(error);
                });
            });
        }

        /**
         * Fetch an overview of the accounts of the current user
         */

    }, {
        key: 'getOverview',
        value: function getOverview() {
            return new _Request2.default({
                path: '/_mobile/account/overview',
                method: 'GET',
                headers: {
                    'X-AuthenticationSession': this._authenticationSession,
                    'X-SecurityToken': this._securityToken
                }
            });
        }

        /**
         * Fetch recent transactions and orders by the current user
         */

    }, {
        key: 'getDealsAndOrders',
        value: function getDealsAndOrders() {
            return new _Request2.default({
                path: '/_mobile/account/dealsandorders',
                method: 'GET',
                headers: {
                    'X-AuthenticationSession': this._authenticationSession,
                    'X-SecurityToken': this._securityToken
                }
            });
        }

        /**
         * Fetch the current user's watchlists
         */

    }, {
        key: 'getWatchlists',
        value: function getWatchlists() {
            return new _Request2.default({
                path: '/_mobile/usercontent/watchlist',
                method: 'GET',
                headers: {
                    'X-AuthenticationSession': this._authenticationSession,
                    'X-SecurityToken': this._securityToken
                }
            });
        }

        /**
         * Adds an instrument to a watchlist
         *
         * @param instrumentId
         * @param watchlistId
         */

    }, {
        key: 'addToWatchlist',
        value: function addToWatchlist(instrumentId, watchlistId) {
            return new _Request2.default({
                path: '/_api/usercontent/watchlist/' + watchlistId + '/orderbooks/' + instrumentId,
                method: 'PUT',
                headers: {
                    'X-AuthenticationSession': this._authenticationSession,
                    'X-SecurityToken': this._securityToken
                }
            });
        }

        /**
         * Fetch information about a stock
         *
         * @param id The instrument id
         */

    }, {
        key: 'getStock',
        value: function getStock(id) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                return new _Request2.default({
                    path: '/_mobile/market/stock/' + id,
                    headers: {
                        'X-AuthenticationSession': _this._authenticationSession,
                        'X-SecurityToken': _this._securityToken
                    }
                }).then(function (instrument) {
                    resolve(new _Instrument2.default(instrument));
                }).catch(function (error) {
                    return reject(error);
                });
            });
        }

        /**
         * Fetch information about a fund
         *
         * @param id
         */

    }, {
        key: 'getFund',
        value: function getFund(id) {
            return new _Request2.default({
                path: '/_mobile/market/fund/' + id,
                headers: {
                    'X-AuthenticationSession': this._authenticationSession,
                    'X-SecurityToken': this._securityToken
                }
            });
        }

        /**
         * Fetch detailed orderbook information for a given instrument. Note that both id and type is required.
         *
         * @param id
         * @param type One of the following lowercase strings: stock, fund, bond, option, future_forward, certificate, warrant,
         * exchange_traded_fund or index.
         */

    }, {
        key: 'getOrderbook',
        value: function getOrderbook(id, type) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {

                return new _Request2.default({
                    path: '/_mobile/order/' + type.toLowerCase() + '?' + _querystring2.default.stringify({
                        orderbookId: id
                    }),
                    headers: {
                        'X-AuthenticationSession': _this2._authenticationSession,
                        'X-SecurityToken': _this2._securityToken
                    }
                }).then(function (orderbook) {
                    resolve(new _Orderbook2.default(orderbook));
                }).catch(function (error) {
                    return reject(error);
                });
            });
        }

        /**
         * Fetch a list of orderbook information.
         *
         * @param ids An array of ids
         */

    }, {
        key: 'getOrderbooks',
        value: function getOrderbooks(ids) {
            return new _Request2.default({
                path: '/_mobile/market/orderbooklist' + ids.join(',') + '?' + _querystring2.default.stringify({
                    sort: 'name'
                }),
                headers: {
                    'X-AuthenticationSession': this._authenticationSession,
                    'X-SecurityToken': this._securityToken
                }
            });
        }

        /**
         * Place an order.
         *
         * @param options An object containing the following properties: price, validUntil ("Y-m-d"), volume, orderbookId,
         * orderType (either "BUY" or "SELL") and accountId.
         */

    }, {
        key: 'placeOrder',
        value: function placeOrder(options) {
            return new _Request2.default({
                path: '/_api/order',
                data: options,
                headers: {
                    'X-AuthenticationSession': this._authenticationSession,
                    'X-SecurityToken': this._securityToken
                }
            });
        }

        /**
         * Fetches a request status (a request is what precedes an order)
         *
         * @param accountId
         * @param requestId
         */

    }, {
        key: 'checkOrder',
        value: function checkOrder(accountId, requestId) {
            return new _Request2.default({
                path: '/_api/order?' + _querystring2.default.stringify({
                    accountId: accountId,
                    requestId: requestId
                }),
                method: 'GET',
                headers: {
                    'X-AuthenticationSession': this._authenticationSession,
                    'X-SecurityToken': this._securityToken
                }
            });
        }

        /**
         * Deletes an order
         *
         * @param accountId
         * @param orderId
         */

    }, {
        key: 'deleteOrder',
        value: function deleteOrder(accountId, orderId) {
            return new _Request2.default({
                path: '/_api/order?' + _querystring2.default.stringify({
                    accountId: accountId,
                    orderId: orderId
                }),
                method: 'DELETE',
                headers: {
                    'X-AuthenticationSession': this._authenticationSession,
                    'X-SecurityToken': this._securityToken
                }
            });
        }

        /**
         * Searches for the given query. If type is supplied, only search for results of specified type.
         *
         * @param query
         * @param type One of the following uppercase strings: STOCK, FUND, BOND, OPTION, FUTURE_FORWARD, CERTIFICATE, WARRANT,
         * EXCHANGE_TRADED_FUND or INDEX.
         */

    }, {
        key: 'search',
        value: function search(query, type) {

            var path = void 0;
            if (type) {
                path = '/_mobile/market/search/' + type.toUpperCase() + '?' + _querystring2.default.stringify({
                    limit: 100,
                    query: query
                });
            } else {
                path = '/_mobile/market/search?' + _querystring2.default.stringify({
                    query: query
                });
            }

            return new _Request2.default({
                path: path,
                method: 'GET',
                headers: {
                    'X-AuthenticationSession': this._authenticationSession,
                    'X-SecurityToken': this._securityToken
                }
            });
        }

        /**
         * Authenticate credentials
         *
         * @param credentials An object containing the properties username and password
         * @param force Do authentication even if the user is already authenticated
         */

    }, {
        key: 'authenticate',
        value: function authenticate(credentials, force) {

            var that = this;
            return new Promise(function (resolve, reject) {

                if (that.isAuthenticated && !force) {

                    resolve({
                        securityToken: that._securityToken,
                        authenticationSession: that._authenticationSession,
                        subscriptionId: that._subscriptionId
                    });
                } else {
                    (function () {

                        var securityToken = void 0;

                        /**
                         * Create the authentication request
                         */
                        var authenticate = new _Request2.default({
                            path: '/_api/authentication/sessions/username',
                            headers: {
                                'Content-Length': '80'
                            },
                            data: {
                                'maxInactiveMinutes': '1440',
                                'password': credentials.password,
                                'username': credentials.username
                            },
                            onEnd: function onEnd(response) {

                                /**
                                 * Parse the securitytoken from the headers of the responsee
                                 */
                                securityToken = response.headers['x-securitytoken'];
                            }
                        });

                        authenticate.then(function (response) {

                            that.isAuthenticated = true;
                            that._securityToken = securityToken;
                            that._authenticationSession = response.authenticationSession;
                            that._subscriptionId = response.pushSubscriptionId;

                            resolve({
                                securityToken: that._securityToken,
                                authenticationSession: that._authenticationSession,
                                subscriptionId: that._subscriptionId
                            });
                        }).catch(function (e) {
                            return reject(e);
                        });
                    })();
                }
            });
        }
    }, {
        key: 'authenticationSession',
        get: function get() {
            return this._authenticationSession;
        },
        set: function set(value) {
            this._authenticationSession = value;
        }
    }, {
        key: 'securityToken',
        get: function get() {
            return this._securityToken;
        },
        set: function set(value) {
            this._securityToken = value;
        }
    }]);

    return Avanza;
}();

exports.default = Avanza;