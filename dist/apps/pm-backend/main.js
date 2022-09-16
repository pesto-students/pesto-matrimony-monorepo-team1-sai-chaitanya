/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@sentry/core/esm/api.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getEnvelopeEndpointWithUrlEncodedAuth": () => (/* binding */ getEnvelopeEndpointWithUrlEncodedAuth),
/* harmony export */   "getReportDialogEndpoint": () => (/* binding */ getReportDialogEndpoint)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/object.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/dsn.js");


var SENTRY_API_VERSION = '7';

/** Returns the prefix to construct Sentry ingestion API endpoints. */
function getBaseApiEndpoint(dsn) {
  var protocol = dsn.protocol ? `${dsn.protocol}:` : '';
  var port = dsn.port ? `:${dsn.port}` : '';
  return `${protocol}//${dsn.host}${port}${dsn.path ? `/${dsn.path}` : ''}/api/`;
}

/** Returns the ingest API endpoint for target. */
function _getIngestEndpoint(dsn) {
  return `${getBaseApiEndpoint(dsn)}${dsn.projectId}/envelope/`;
}

/** Returns a URL-encoded string with auth config suitable for a query string. */
function _encodedAuth(dsn, sdkInfo) {
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.urlEncode)({
    // We send only the minimum set of required information. See
    // https://github.com/getsentry/sentry-javascript/issues/2572.
    sentry_key: dsn.publicKey,
    sentry_version: SENTRY_API_VERSION,
    ...(sdkInfo && { sentry_client: `${sdkInfo.name}/${sdkInfo.version}` }),
  });
}

/**
 * Returns the envelope endpoint URL with auth in the query string.
 *
 * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
 */
function getEnvelopeEndpointWithUrlEncodedAuth(
  dsn,
  // TODO (v8): Remove `tunnelOrOptions` in favor of `options`, and use the substitute code below
  // options: ClientOptions = {} as ClientOptions,
  tunnelOrOptions = {} ,
) {
  // TODO (v8): Use this code instead
  // const { tunnel, _metadata = {} } = options;
  // return tunnel ? tunnel : `${_getIngestEndpoint(dsn)}?${_encodedAuth(dsn, _metadata.sdk)}`;

  var tunnel = typeof tunnelOrOptions === 'string' ? tunnelOrOptions : tunnelOrOptions.tunnel;
  var sdkInfo =
    typeof tunnelOrOptions === 'string' || !tunnelOrOptions._metadata ? undefined : tunnelOrOptions._metadata.sdk;

  return tunnel ? tunnel : `${_getIngestEndpoint(dsn)}?${_encodedAuth(dsn, sdkInfo)}`;
}

/** Returns the url to the report dialog endpoint. */
function getReportDialogEndpoint(
  dsnLike,
  dialogOptions

,
) {
  var dsn = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.makeDsn)(dsnLike);
  var endpoint = `${getBaseApiEndpoint(dsn)}embed/error-page/`;

  let encodedOptions = `dsn=${(0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.dsnToString)(dsn)}`;
  for (var key in dialogOptions) {
    if (key === 'dsn') {
      continue;
    }

    if (key === 'user') {
      var user = dialogOptions.user;
      if (!user) {
        continue;
      }
      if (user.name) {
        encodedOptions += `&name=${encodeURIComponent(user.name)}`;
      }
      if (user.email) {
        encodedOptions += `&email=${encodeURIComponent(user.email)}`;
      }
    } else {
      encodedOptions += `&${encodeURIComponent(key)}=${encodeURIComponent(dialogOptions[key] )}`;
    }
  }

  return `${endpoint}?${encodedOptions}`;
}


//# sourceMappingURL=api.js.map


/***/ }),

/***/ "./node_modules/@sentry/core/esm/baseclient.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BaseClient": () => (/* binding */ BaseClient)
/* harmony export */ });
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/hub/esm/session.js");
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./node_modules/@sentry/hub/esm/scope.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/dsn.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/utils/esm/misc.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/utils/esm/is.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@sentry/utils/esm/syncpromise.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./node_modules/@sentry/utils/esm/envelope.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./node_modules/@sentry/utils/esm/time.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./node_modules/@sentry/utils/esm/normalize.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./node_modules/@sentry/utils/esm/string.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./node_modules/@sentry/utils/esm/error.js");
/* harmony import */ var _api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/core/esm/api.js");
/* harmony import */ var _envelope_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/@sentry/core/esm/envelope.js");
/* harmony import */ var _integration_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/@sentry/core/esm/integration.js");






var ALREADY_SEEN_ERROR = "Not capturing exception because it's already been captured.";

/**
 * Base implementation for all JavaScript SDK clients.
 *
 * Call the constructor with the corresponding options
 * specific to the client subclass. To access these options later, use
 * {@link Client.getOptions}.
 *
 * If a Dsn is specified in the options, it will be parsed and stored. Use
 * {@link Client.getDsn} to retrieve the Dsn at any moment. In case the Dsn is
 * invalid, the constructor will throw a {@link SentryException}. Note that
 * without a valid Dsn, the SDK will not send any events to Sentry.
 *
 * Before sending an event, it is passed through
 * {@link BaseClient._prepareEvent} to add SDK information and scope data
 * (breadcrumbs and context). To add more custom information, override this
 * method and extend the resulting prepared event.
 *
 * To issue automatically created events (e.g. via instrumentation), use
 * {@link Client.captureEvent}. It will prepare the event and pass it through
 * the callback lifecycle. To issue auto-breadcrumbs, use
 * {@link Client.addBreadcrumb}.
 *
 * @example
 * class NodeClient extends BaseClient<NodeOptions> {
 *   public constructor(options: NodeOptions) {
 *     super(options);
 *   }
 *
 *   // ...
 * }
 */
class BaseClient {
  /** Options passed to the SDK. */
  

  /** The client Dsn, if specified in options. Without this Dsn, the SDK will be disabled. */
  

  /** Array of set up integrations. */
   __init() {this._integrations = {};}

  /** Indicates whether this client's integrations have been set up. */
   __init2() {this._integrationsInitialized = false;}

  /** Number of calls being processed */
   __init3() {this._numProcessing = 0;}

  /** Holds flushable  */
   __init4() {this._outcomes = {};}

  /**
   * Initializes this client instance.
   *
   * @param options Options for the client.
   */
   constructor(options) {;BaseClient.prototype.__init.call(this);BaseClient.prototype.__init2.call(this);BaseClient.prototype.__init3.call(this);BaseClient.prototype.__init4.call(this);
    this._options = options;
    if (options.dsn) {
      this._dsn = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.makeDsn)(options.dsn);
      var url = (0,_api_js__WEBPACK_IMPORTED_MODULE_1__.getEnvelopeEndpointWithUrlEncodedAuth)(this._dsn, options);
      this._transport = options.transport({
        recordDroppedEvent: this.recordDroppedEvent.bind(this),
        ...options.transportOptions,
        url,
      });
    } else {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.warn('No DSN provided, client will not do anything.');
    }
  }

  /**
   * @inheritDoc
   */
     captureException(exception, hint, scope) {
    // ensure we haven't captured this very object before
    if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.checkOrSetAlreadyCaught)(exception)) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.log(ALREADY_SEEN_ERROR);
      return;
    }

    let eventId = hint && hint.event_id;

    this._process(
      this.eventFromException(exception, hint)
        .then(event => this._captureEvent(event, hint, scope))
        .then(result => {
          eventId = result;
        }),
    );

    return eventId;
  }

  /**
   * @inheritDoc
   */
   captureMessage(
    message,
        level,
    hint,
    scope,
  ) {
    let eventId = hint && hint.event_id;

    var promisedEvent = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.isPrimitive)(message)
      ? this.eventFromMessage(String(message), level, hint)
      : this.eventFromException(message, hint);

    this._process(
      promisedEvent
        .then(event => this._captureEvent(event, hint, scope))
        .then(result => {
          eventId = result;
        }),
    );

    return eventId;
  }

  /**
   * @inheritDoc
   */
   captureEvent(event, hint, scope) {
    // ensure we haven't captured this very object before
    if (hint && hint.originalException && (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.checkOrSetAlreadyCaught)(hint.originalException)) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.log(ALREADY_SEEN_ERROR);
      return;
    }

    let eventId = hint && hint.event_id;

    this._process(
      this._captureEvent(event, hint, scope).then(result => {
        eventId = result;
      }),
    );

    return eventId;
  }

  /**
   * @inheritDoc
   */
   captureSession(session) {
    if (!this._isEnabled()) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.warn('SDK not enabled, will not capture session.');
      return;
    }

    if (!(typeof session.release === 'string')) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.warn('Discarded session because of missing or non-string release');
    } else {
      this.sendSession(session);
      // After sending, we set init false to indicate it's not the first occurrence
      (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_5__.updateSession)(session, { init: false });
    }
  }

  /**
   * @inheritDoc
   */
   getDsn() {
    return this._dsn;
  }

  /**
   * @inheritDoc
   */
   getOptions() {
    return this._options;
  }

  /**
   * @inheritDoc
   */
   getTransport() {
    return this._transport;
  }

  /**
   * @inheritDoc
   */
   flush(timeout) {
    var transport = this._transport;
    if (transport) {
      return this._isClientDoneProcessing(timeout).then(clientFinished => {
        return transport.flush(timeout).then(transportFlushed => clientFinished && transportFlushed);
      });
    } else {
      return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.resolvedSyncPromise)(true);
    }
  }

  /**
   * @inheritDoc
   */
   close(timeout) {
    return this.flush(timeout).then(result => {
      this.getOptions().enabled = false;
      return result;
    });
  }

  /**
   * Sets up the integrations
   */
   setupIntegrations() {
    if (this._isEnabled() && !this._integrationsInitialized) {
      this._integrations = (0,_integration_js__WEBPACK_IMPORTED_MODULE_7__.setupIntegrations)(this._options.integrations);
      this._integrationsInitialized = true;
    }
  }

  /**
   * Gets an installed integration by its `id`.
   *
   * @returns The installed integration or `undefined` if no integration with that `id` was installed.
   */
   getIntegrationById(integrationId) {
    return this._integrations[integrationId];
  }

  /**
   * @inheritDoc
   */
   getIntegration(integration) {
    try {
      return (this._integrations[integration.id] ) || null;
    } catch (_oO) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.warn(`Cannot retrieve integration ${integration.id} from the current Client`);
      return null;
    }
  }

  /**
   * @inheritDoc
   */
   sendEvent(event, hint = {}) {
    if (this._dsn) {
      let env = (0,_envelope_js__WEBPACK_IMPORTED_MODULE_8__.createEventEnvelope)(event, this._dsn, this._options._metadata, this._options.tunnel);

      for (var attachment of hint.attachments || []) {
        env = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_9__.addItemToEnvelope)(
          env,
          (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_9__.createAttachmentEnvelopeItem)(
            attachment,
            this._options.transportOptions && this._options.transportOptions.textEncoder,
          ),
        );
      }

      this._sendEnvelope(env);
    }
  }

  /**
   * @inheritDoc
   */
   sendSession(session) {
    if (this._dsn) {
      var env = (0,_envelope_js__WEBPACK_IMPORTED_MODULE_8__.createSessionEnvelope)(session, this._dsn, this._options._metadata, this._options.tunnel);
      this._sendEnvelope(env);
    }
  }

  /**
   * @inheritDoc
   */
   recordDroppedEvent(reason, category) {
    if (this._options.sendClientReports) {
      // We want to track each category (error, transaction, session) separately
      // but still keep the distinction between different type of outcomes.
      // We could use nested maps, but it's much easier to read and type this way.
      // A correct type for map-based implementation if we want to go that route
      // would be `Partial<Record<SentryRequestType, Partial<Record<Outcome, number>>>>`
      // With typescript 4.1 we could even use template literal types
      var key = `${reason}:${category}`;
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.log(`Adding outcome: "${key}"`);

      // The following works because undefined + 1 === NaN and NaN is falsy
      this._outcomes[key] = this._outcomes[key] + 1 || 1;
    }
  }

  /** Updates existing session based on the provided event */
   _updateSessionFromEvent(session, event) {
    let crashed = false;
    let errored = false;
    var exceptions = event.exception && event.exception.values;

    if (exceptions) {
      errored = true;

      for (var ex of exceptions) {
        var mechanism = ex.mechanism;
        if (mechanism && mechanism.handled === false) {
          crashed = true;
          break;
        }
      }
    }

    // A session is updated and that session update is sent in only one of the two following scenarios:
    // 1. Session with non terminal status and 0 errors + an error occurred -> Will set error count to 1 and send update
    // 2. Session with non terminal status and 1 error + a crash occurred -> Will set status crashed and send update
    var sessionNonTerminal = session.status === 'ok';
    var shouldUpdateAndSend = (sessionNonTerminal && session.errors === 0) || (sessionNonTerminal && crashed);

    if (shouldUpdateAndSend) {
      (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_5__.updateSession)(session, {
        ...(crashed && { status: 'crashed' }),
        errors: session.errors || Number(errored || crashed),
      });
      this.captureSession(session);
    }
  }

  /**
   * Determine if the client is finished processing. Returns a promise because it will wait `timeout` ms before saying
   * "no" (resolving to `false`) in order to give the client a chance to potentially finish first.
   *
   * @param timeout The time, in ms, after which to resolve to `false` if the client is still busy. Passing `0` (or not
   * passing anything) will make the promise wait as long as it takes for processing to finish before resolving to
   * `true`.
   * @returns A promise which will resolve to `true` if processing is already done or finishes before the timeout, and
   * `false` otherwise
   */
   _isClientDoneProcessing(timeout) {
    return new _sentry_utils__WEBPACK_IMPORTED_MODULE_6__.SyncPromise(resolve => {
      let ticked = 0;
      var tick = 1;

      var interval = setInterval(() => {
        if (this._numProcessing == 0) {
          clearInterval(interval);
          resolve(true);
        } else {
          ticked += tick;
          if (timeout && ticked >= timeout) {
            clearInterval(interval);
            resolve(false);
          }
        }
      }, tick);
    });
  }

  /** Determines whether this SDK is enabled and a valid Dsn is present. */
   _isEnabled() {
    return this.getOptions().enabled !== false && this._dsn !== undefined;
  }

  /**
   * Adds common information to events.
   *
   * The information includes release and environment from `options`,
   * breadcrumbs and context (extra, tags and user) from the scope.
   *
   * Information that is already present in the event is never overwritten. For
   * nested objects, such as the context, keys are merged.
   *
   * @param event The original event.
   * @param hint May contain additional information about the original exception.
   * @param scope A scope containing event metadata.
   * @returns A new event with more information.
   */
   _prepareEvent(event, hint, scope) {
    const { normalizeDepth = 3, normalizeMaxBreadth = 1000 } = this.getOptions();
    var prepared = {
      ...event,
      event_id: event.event_id || hint.event_id || (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.uuid4)(),
      timestamp: event.timestamp || (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_10__.dateTimestampInSeconds)(),
    };

    this._applyClientOptions(prepared);
    this._applyIntegrationsMetadata(prepared);

    // If we have scope given to us, use it as the base for further modifications.
    // This allows us to prevent unnecessary copying of data if `captureContext` is not provided.
    let finalScope = scope;
    if (hint.captureContext) {
      finalScope = _sentry_hub__WEBPACK_IMPORTED_MODULE_11__.Scope.clone(finalScope).update(hint.captureContext);
    }

    // We prepare the result here with a resolved Event.
    let result = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.resolvedSyncPromise)(prepared);

    // This should be the last thing called, since we want that
    // {@link Hub.addEventProcessor} gets the finished prepared event.
    if (finalScope) {
      // Collect attachments from the hint and scope
      var attachments = [...(hint.attachments || []), ...finalScope.getAttachments()];

      if (attachments.length) {
        hint.attachments = attachments;
      }

      // In case we have a hub we reassign it.
      result = finalScope.applyToEvent(prepared, hint);
    }

    return result.then(evt => {
      if (typeof normalizeDepth === 'number' && normalizeDepth > 0) {
        return this._normalizeEvent(evt, normalizeDepth, normalizeMaxBreadth);
      }
      return evt;
    });
  }

  /**
   * Applies `normalize` function on necessary `Event` attributes to make them safe for serialization.
   * Normalized keys:
   * - `breadcrumbs.data`
   * - `user`
   * - `contexts`
   * - `extra`
   * @param event Event
   * @returns Normalized event
   */
   _normalizeEvent(event, depth, maxBreadth) {
    if (!event) {
      return null;
    }

    var normalized = {
      ...event,
      ...(event.breadcrumbs && {
        breadcrumbs: event.breadcrumbs.map(b => ({
          ...b,
          ...(b.data && {
            data: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_12__.normalize)(b.data, depth, maxBreadth),
          }),
        })),
      }),
      ...(event.user && {
        user: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_12__.normalize)(event.user, depth, maxBreadth),
      }),
      ...(event.contexts && {
        contexts: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_12__.normalize)(event.contexts, depth, maxBreadth),
      }),
      ...(event.extra && {
        extra: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_12__.normalize)(event.extra, depth, maxBreadth),
      }),
    };

    // event.contexts.trace stores information about a Transaction. Similarly,
    // event.spans[] stores information about child Spans. Given that a
    // Transaction is conceptually a Span, normalization should apply to both
    // Transactions and Spans consistently.
    // For now the decision is to skip normalization of Transactions and Spans,
    // so this block overwrites the normalized event to add back the original
    // Transaction information prior to normalization.
    if (event.contexts && event.contexts.trace && normalized.contexts) {
      normalized.contexts.trace = event.contexts.trace;

      // event.contexts.trace.data may contain circular/dangerous data so we need to normalize it
      if (event.contexts.trace.data) {
        normalized.contexts.trace.data = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_12__.normalize)(event.contexts.trace.data, depth, maxBreadth);
      }
    }

    // event.spans[].data may contain circular/dangerous data so we need to normalize it
    if (event.spans) {
      normalized.spans = event.spans.map(span => {
        // We cannot use the spread operator here because `toJSON` on `span` is non-enumerable
        if (span.data) {
          span.data = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_12__.normalize)(span.data, depth, maxBreadth);
        }
        return span;
      });
    }

    return normalized;
  }

  /**
   *  Enhances event using the client configuration.
   *  It takes care of all "static" values like environment, release and `dist`,
   *  as well as truncating overly long values.
   * @param event event instance to be enhanced
   */
   _applyClientOptions(event) {
    var options = this.getOptions();
    const { environment, release, dist, maxValueLength = 250 } = options;

    if (!('environment' in event)) {
      event.environment = 'environment' in options ? environment : 'production';
    }

    if (event.release === undefined && release !== undefined) {
      event.release = release;
    }

    if (event.dist === undefined && dist !== undefined) {
      event.dist = dist;
    }

    if (event.message) {
      event.message = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_13__.truncate)(event.message, maxValueLength);
    }

    var exception = event.exception && event.exception.values && event.exception.values[0];
    if (exception && exception.value) {
      exception.value = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_13__.truncate)(exception.value, maxValueLength);
    }

    var request = event.request;
    if (request && request.url) {
      request.url = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_13__.truncate)(request.url, maxValueLength);
    }
  }

  /**
   * This function adds all used integrations to the SDK info in the event.
   * @param event The event that will be filled with all integrations.
   */
   _applyIntegrationsMetadata(event) {
    var integrationsArray = Object.keys(this._integrations);
    if (integrationsArray.length > 0) {
      event.sdk = event.sdk || {};
      event.sdk.integrations = [...(event.sdk.integrations || []), ...integrationsArray];
    }
  }

  /**
   * Processes the event and logs an error in case of rejection
   * @param event
   * @param hint
   * @param scope
   */
   _captureEvent(event, hint = {}, scope) {
    return this._processEvent(event, hint, scope).then(
      finalEvent => {
        return finalEvent.event_id;
      },
      reason => {
        if ((typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__)) {
          // If something's gone wrong, log the error as a warning. If it's just us having used a `SentryError` for
          // control flow, log just the message (no stack) as a log-level log.
          var sentryError = reason ;
          if (sentryError.logLevel === 'log') {
            _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.log(sentryError.message);
          } else {
            _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.warn(sentryError);
          }
        }
        return undefined;
      },
    );
  }

  /**
   * Processes an event (either error or message) and sends it to Sentry.
   *
   * This also adds breadcrumbs and context information to the event. However,
   * platform specific meta data (such as the User's IP address) must be added
   * by the SDK implementor.
   *
   *
   * @param event The event to send to Sentry.
   * @param hint May contain additional information about the original exception.
   * @param scope A scope containing event metadata.
   * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
   */
   _processEvent(event, hint, scope) {
    const { beforeSend, sampleRate } = this.getOptions();

    if (!this._isEnabled()) {
      return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.rejectedSyncPromise)(new _sentry_utils__WEBPACK_IMPORTED_MODULE_14__.SentryError('SDK not enabled, will not capture event.', 'log'));
    }

    var isTransaction = event.type === 'transaction';
    // 1.0 === 100% events are sent
    // 0.0 === 0% events are sent
    // Sampling for transaction happens somewhere else
    if (!isTransaction && typeof sampleRate === 'number' && Math.random() > sampleRate) {
      this.recordDroppedEvent('sample_rate', 'error');
      return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.rejectedSyncPromise)(
        new _sentry_utils__WEBPACK_IMPORTED_MODULE_14__.SentryError(
          `Discarding event because it's not included in the random sample (sampling rate = ${sampleRate})`,
          'log',
        ),
      );
    }

    return this._prepareEvent(event, hint, scope)
      .then(prepared => {
        if (prepared === null) {
          this.recordDroppedEvent('event_processor', event.type || 'error');
          throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_14__.SentryError('An event processor returned null, will not send event.', 'log');
        }

        var isInternalException = hint.data && (hint.data ).__sentry__ === true;
        if (isInternalException || isTransaction || !beforeSend) {
          return prepared;
        }

        var beforeSendResult = beforeSend(prepared, hint);
        return _ensureBeforeSendRv(beforeSendResult);
      })
      .then(processedEvent => {
        if (processedEvent === null) {
          this.recordDroppedEvent('before_send', event.type || 'error');
          throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_14__.SentryError('`beforeSend` returned `null`, will not send event.', 'log');
        }

        var session = scope && scope.getSession();
        if (!isTransaction && session) {
          this._updateSessionFromEvent(session, processedEvent);
        }

        this.sendEvent(processedEvent, hint);
        return processedEvent;
      })
      .then(null, reason => {
        if (reason instanceof _sentry_utils__WEBPACK_IMPORTED_MODULE_14__.SentryError) {
          throw reason;
        }

        this.captureException(reason, {
          data: {
            __sentry__: true,
          },
          originalException: reason ,
        });
        throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_14__.SentryError(
          `Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.\nReason: ${reason}`,
        );
      });
  }

  /**
   * Occupies the client with processing and event
   */
   _process(promise) {
    this._numProcessing += 1;
    void promise.then(
      value => {
        this._numProcessing -= 1;
        return value;
      },
      reason => {
        this._numProcessing -= 1;
        return reason;
      },
    );
  }

  /**
   * @inheritdoc
   */
   _sendEnvelope(envelope) {
    if (this._transport && this._dsn) {
      this._transport.send(envelope).then(null, reason => {
        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.error('Error while sending event:', reason);
      });
    } else {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.error('Transport disabled');
    }
  }

  /**
   * Clears outcomes on this client and returns them.
   */
   _clearOutcomes() {
    var outcomes = this._outcomes;
    this._outcomes = {};
    return Object.keys(outcomes).map(key => {
      const [reason, category] = key.split(':') ;
      return {
        reason,
        category,
        quantity: outcomes[key],
      };
    });
  }

  /**
   * @inheritDoc
   */
    

}

/**
 * Verifies that return value of configured `beforeSend` is of expected type.
 */
function _ensureBeforeSendRv(rv) {
  var nullErr = '`beforeSend` method has to return `null` or a valid event.';
  if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.isThenable)(rv)) {
    return rv.then(
      event => {
        if (!((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.isPlainObject)(event) || event === null)) {
          throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_14__.SentryError(nullErr);
        }
        return event;
      },
      e => {
        throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_14__.SentryError(`beforeSend rejected with ${e}`);
      },
    );
  } else if (!((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.isPlainObject)(rv) || rv === null)) {
    throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_14__.SentryError(nullErr);
  }
  return rv;
}


//# sourceMappingURL=baseclient.js.map


/***/ }),

/***/ "./node_modules/@sentry/core/esm/envelope.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createEventEnvelope": () => (/* binding */ createEventEnvelope),
/* harmony export */   "createSessionEnvelope": () => (/* binding */ createSessionEnvelope)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/dsn.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/envelope.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/utils/esm/baggage.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/utils/esm/object.js");


/** Extract sdk info from from the API metadata */
function getSdkMetadataForEnvelopeHeader(metadata) {
  if (!metadata || !metadata.sdk) {
    return;
  }
  const { name, version } = metadata.sdk;
  return { name, version };
}

/**
 * Apply SdkInfo (name, version, packages, integrations) to the corresponding event key.
 * Merge with existing data if any.
 **/
function enhanceEventWithSdkInfo(event, sdkInfo) {
  if (!sdkInfo) {
    return event;
  }
  event.sdk = event.sdk || {};
  event.sdk.name = event.sdk.name || sdkInfo.name;
  event.sdk.version = event.sdk.version || sdkInfo.version;
  event.sdk.integrations = [...(event.sdk.integrations || []), ...(sdkInfo.integrations || [])];
  event.sdk.packages = [...(event.sdk.packages || []), ...(sdkInfo.packages || [])];
  return event;
}

/** Creates an envelope from a Session */
function createSessionEnvelope(
  session,
  dsn,
  metadata,
  tunnel,
) {
  var sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);
  var envelopeHeaders = {
    sent_at: new Date().toISOString(),
    ...(sdkInfo && { sdk: sdkInfo }),
    ...(!!tunnel && { dsn: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.dsnToString)(dsn) }),
  };

  var envelopeItem =
    'aggregates' in session ? [{ type: 'sessions' }, session] : [{ type: 'session' }, session];

  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.createEnvelope)(envelopeHeaders, [envelopeItem]);
}

/**
 * Create an Envelope from an event.
 */
function createEventEnvelope(
  event,
  dsn,
  metadata,
  tunnel,
) {
  var sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);
  var eventType = event.type || 'event';

  const { transactionSampling } = event.sdkProcessingMetadata || {};
  const { method: samplingMethod, rate: sampleRate } = transactionSampling || {};

  enhanceEventWithSdkInfo(event, metadata && metadata.sdk);

  var envelopeHeaders = createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn);

  // Prevent this data (which, if it exists, was used in earlier steps in the processing pipeline) from being sent to
  // sentry. (Note: Our use of this property comes and goes with whatever we might be debugging, whatever hacks we may
  // have temporarily added, etc. Even if we don't happen to be using it at some point in the future, let's not get rid
  // of this `delete`, lest we miss putting it back in the next time the property is in use.)
  delete event.sdkProcessingMetadata;

  var eventItem = [
    {
      type: eventType,
      sample_rates: [{ id: samplingMethod, rate: sampleRate }],
    },
    event,
  ];
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.createEnvelope)(envelopeHeaders, [eventItem]);
}

function createEventEnvelopeHeaders(
  event,
  sdkInfo,
  tunnel,
  dsn,
) {
  var baggage = event.sdkProcessingMetadata && event.sdkProcessingMetadata.baggage;
  var dynamicSamplingContext = baggage && (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.getSentryBaggageItems)(baggage);

  return {
    event_id: event.event_id ,
    sent_at: new Date().toISOString(),
    ...(sdkInfo && { sdk: sdkInfo }),
    ...(!!tunnel && { dsn: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.dsnToString)(dsn) }),
    ...(event.type === 'transaction' &&
      dynamicSamplingContext && {
        trace: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.dropUndefinedKeys)({ ...dynamicSamplingContext }) ,
      }),
  };
}


//# sourceMappingURL=envelope.js.map


/***/ }),

/***/ "./node_modules/@sentry/core/esm/integration.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getIntegrationsToSetup": () => (/* binding */ getIntegrationsToSetup),
/* harmony export */   "installedIntegrations": () => (/* binding */ installedIntegrations),
/* harmony export */   "setupIntegrations": () => (/* binding */ setupIntegrations)
/* harmony export */ });
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/hub/esm/scope.js");
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/hub/esm/hub.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/utils/esm/logger.js");



var installedIntegrations = [];

/** Map of integrations assigned to a client */

/**
 * @private
 */
function filterDuplicates(integrations) {
  return integrations.reduce((acc, integrations) => {
    if (acc.every(accIntegration => integrations.name !== accIntegration.name)) {
      acc.push(integrations);
    }
    return acc;
  }, [] );
}

/** Gets integration to install */
function getIntegrationsToSetup(options) {
  var defaultIntegrations = (options.defaultIntegrations && [...options.defaultIntegrations]) || [];
  var userIntegrations = options.integrations;

  let integrations = [...filterDuplicates(defaultIntegrations)];

  if (Array.isArray(userIntegrations)) {
    // Filter out integrations that are also included in user options
    integrations = [
      ...integrations.filter(integrations =>
        userIntegrations.every(userIntegration => userIntegration.name !== integrations.name),
      ),
      // And filter out duplicated user options integrations
      ...filterDuplicates(userIntegrations),
    ];
  } else if (typeof userIntegrations === 'function') {
    integrations = userIntegrations(integrations);
    integrations = Array.isArray(integrations) ? integrations : [integrations];
  }

  // Make sure that if present, `Debug` integration will always run last
  var integrationsNames = integrations.map(i => i.name);
  var alwaysLastToRun = 'Debug';
  if (integrationsNames.indexOf(alwaysLastToRun) !== -1) {
    integrations.push(...integrations.splice(integrationsNames.indexOf(alwaysLastToRun), 1));
  }

  return integrations;
}

/**
 * Given a list of integration instances this installs them all. When `withDefaults` is set to `true` then all default
 * integrations are added unless they were already provided before.
 * @param integrations array of integration instances
 * @param withDefault should enable default integrations
 */
function setupIntegrations(integrations) {
  var integrationIndex = {};

  integrations.forEach(integration => {
    integrationIndex[integration.name] = integration;

    if (installedIntegrations.indexOf(integration.name) === -1) {
      integration.setupOnce(_sentry_hub__WEBPACK_IMPORTED_MODULE_0__.addGlobalEventProcessor, _sentry_hub__WEBPACK_IMPORTED_MODULE_1__.getCurrentHub);
      installedIntegrations.push(integration.name);
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.log(`Integration installed: ${integration.name}`);
    }
  });

  return integrationIndex;
}


//# sourceMappingURL=integration.js.map


/***/ }),

/***/ "./node_modules/@sentry/core/esm/integrations/functiontostring.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FunctionToString": () => (/* binding */ FunctionToString)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/object.js");


let originalFunctionToString;

/** Patch toString calls to return proper name for wrapped functions */
class FunctionToString  {constructor() { FunctionToString.prototype.__init.call(this); }
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'FunctionToString';}

  /**
   * @inheritDoc
   */
   __init() {this.name = FunctionToString.id;}

  /**
   * @inheritDoc
   */
   setupOnce() {
        originalFunctionToString = Function.prototype.toString;

        Function.prototype.toString = function ( ...args) {
      var context = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.getOriginalFunction)(this) || this;
      return originalFunctionToString.apply(context, args);
    };
  }
} FunctionToString.__initStatic();


//# sourceMappingURL=functiontostring.js.map


/***/ }),

/***/ "./node_modules/@sentry/core/esm/integrations/inboundfilters.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InboundFilters": () => (/* binding */ InboundFilters),
/* harmony export */   "_mergeOptions": () => (/* binding */ _mergeOptions),
/* harmony export */   "_shouldDropEvent": () => (/* binding */ _shouldDropEvent)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/misc.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/utils/esm/string.js");


// "Script error." is hard coded into browsers for errors that it can't read.
// this is the result of a script being pulled in from an external domain and CORS.
var DEFAULT_IGNORE_ERRORS = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/];

/** Options for the InboundFilters integration */

/** Inbound filters configurable by the user */
class InboundFilters  {
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'InboundFilters';}

  /**
   * @inheritDoc
   */
   __init() {this.name = InboundFilters.id;}

   constructor(  _options = {}) {;this._options = _options;InboundFilters.prototype.__init.call(this);}

  /**
   * @inheritDoc
   */
   setupOnce(addGlobalEventProcessor, getCurrentHub) {
    var eventProcess = (event) => {
      var hub = getCurrentHub();
      if (hub) {
        var self = hub.getIntegration(InboundFilters);
        if (self) {
          var client = hub.getClient();
          var clientOptions = client ? client.getOptions() : {};
          var options = _mergeOptions(self._options, clientOptions);
          return _shouldDropEvent(event, options) ? null : event;
        }
      }
      return event;
    };

    eventProcess.id = this.name;
    addGlobalEventProcessor(eventProcess);
  }
} InboundFilters.__initStatic();

/** JSDoc */
function _mergeOptions(
  internalOptions = {},
  clientOptions = {},
) {
  return {
    allowUrls: [...(internalOptions.allowUrls || []), ...(clientOptions.allowUrls || [])],
    denyUrls: [...(internalOptions.denyUrls || []), ...(clientOptions.denyUrls || [])],
    ignoreErrors: [
      ...(internalOptions.ignoreErrors || []),
      ...(clientOptions.ignoreErrors || []),
      ...DEFAULT_IGNORE_ERRORS,
    ],
    ignoreInternal: internalOptions.ignoreInternal !== undefined ? internalOptions.ignoreInternal : true,
  };
}

/** JSDoc */
function _shouldDropEvent(event, options) {
  if (options.ignoreInternal && _isSentryError(event)) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
      _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.logger.warn(`Event dropped due to being internal Sentry Error.\nEvent: ${(0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.getEventDescription)(event)}`);
    return true;
  }
  if (_isIgnoredError(event, options.ignoreErrors)) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
      _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.logger.warn(
        `Event dropped due to being matched by \`ignoreErrors\` option.\nEvent: ${(0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.getEventDescription)(event)}`,
      );
    return true;
  }
  if (_isDeniedUrl(event, options.denyUrls)) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
      _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.logger.warn(
        `Event dropped due to being matched by \`denyUrls\` option.\nEvent: ${(0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.getEventDescription)(
          event,
        )}.\nUrl: ${_getEventFilterUrl(event)}`,
      );
    return true;
  }
  if (!_isAllowedUrl(event, options.allowUrls)) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
      _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.logger.warn(
        `Event dropped due to not being matched by \`allowUrls\` option.\nEvent: ${(0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.getEventDescription)(
          event,
        )}.\nUrl: ${_getEventFilterUrl(event)}`,
      );
    return true;
  }
  return false;
}

function _isIgnoredError(event, ignoreErrors) {
  if (!ignoreErrors || !ignoreErrors.length) {
    return false;
  }

  return _getPossibleEventMessages(event).some(message =>
    ignoreErrors.some(pattern => (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.isMatchingPattern)(message, pattern)),
  );
}

function _isDeniedUrl(event, denyUrls) {
  // TODO: Use Glob instead?
  if (!denyUrls || !denyUrls.length) {
    return false;
  }
  var url = _getEventFilterUrl(event);
  return !url ? false : denyUrls.some(pattern => (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.isMatchingPattern)(url, pattern));
}

function _isAllowedUrl(event, allowUrls) {
  // TODO: Use Glob instead?
  if (!allowUrls || !allowUrls.length) {
    return true;
  }
  var url = _getEventFilterUrl(event);
  return !url ? true : allowUrls.some(pattern => (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.isMatchingPattern)(url, pattern));
}

function _getPossibleEventMessages(event) {
  if (event.message) {
    return [event.message];
  }
  if (event.exception) {
    try {
      const { type = '', value = '' } = (event.exception.values && event.exception.values[0]) || {};
      return [`${value}`, `${type}: ${value}`];
    } catch (oO) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.logger.error(`Cannot extract message for event ${(0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.getEventDescription)(event)}`);
      return [];
    }
  }
  return [];
}

function _isSentryError(event) {
  try {
    // @ts-ignore can't be a sentry error if undefined
        return event.exception.values[0].type === 'SentryError';
  } catch (e) {
    // ignore
  }
  return false;
}

function _getLastValidUrl(frames = []) {
  for (let i = frames.length - 1; i >= 0; i--) {
    var frame = frames[i];

    if (frame && frame.filename !== '<anonymous>' && frame.filename !== '[native code]') {
      return frame.filename || null;
    }
  }

  return null;
}

function _getEventFilterUrl(event) {
  try {
    let frames;
    try {
      // @ts-ignore we only care about frames if the whole thing here is defined
      frames = event.exception.values[0].stacktrace.frames;
    } catch (e) {
      // ignore
    }
    return frames ? _getLastValidUrl(frames) : null;
  } catch (oO) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.logger.error(`Cannot extract url for event ${(0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.getEventDescription)(event)}`);
    return null;
  }
}


//# sourceMappingURL=inboundfilters.js.map


/***/ }),

/***/ "./node_modules/@sentry/core/esm/integrations/index.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FunctionToString": () => (/* reexport safe */ _functiontostring_js__WEBPACK_IMPORTED_MODULE_0__.FunctionToString),
/* harmony export */   "InboundFilters": () => (/* reexport safe */ _inboundfilters_js__WEBPACK_IMPORTED_MODULE_1__.InboundFilters)
/* harmony export */ });
/* harmony import */ var _functiontostring_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/core/esm/integrations/functiontostring.js");
/* harmony import */ var _inboundfilters_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/core/esm/integrations/inboundfilters.js");


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/@sentry/core/esm/sdk.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initAndBind": () => (/* binding */ initAndBind)
/* harmony export */ });
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/hub/esm/hub.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/logger.js");



/** A class object that can instantiate Client objects. */

/**
 * Internal function to create a new SDK client instance. The client is
 * installed and then bound to the current scope.
 *
 * @param clientClass The client class to instantiate.
 * @param options Options to pass to the client.
 */
function initAndBind(
  clientClass,
  options,
) {
  if (options.debug === true) {
    if ((typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__)) {
      _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.logger.enable();
    } else {
      // use `console.warn` rather than `logger.warn` since by non-debug bundles have all `logger.x` statements stripped
            console.warn('[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.');
    }
  }
  var hub = (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_1__.getCurrentHub)();
  var scope = hub.getScope();
  if (scope) {
    scope.update(options.initialScope);
  }

  var client = new clientClass(options);
  hub.bindClient(client);
}


//# sourceMappingURL=sdk.js.map


/***/ }),

/***/ "./node_modules/@sentry/core/esm/transports/base.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DEFAULT_TRANSPORT_BUFFER_SIZE": () => (/* binding */ DEFAULT_TRANSPORT_BUFFER_SIZE),
/* harmony export */   "createTransport": () => (/* binding */ createTransport)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/promisebuffer.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/envelope.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/utils/esm/ratelimit.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/utils/esm/syncpromise.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/utils/esm/error.js");


var DEFAULT_TRANSPORT_BUFFER_SIZE = 30;

/**
 * Creates an instance of a Sentry `Transport`
 *
 * @param options
 * @param makeRequest
 */
function createTransport(
  options,
  makeRequest,
  buffer = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.makePromiseBuffer)(options.bufferSize || DEFAULT_TRANSPORT_BUFFER_SIZE),
) {
  let rateLimits = {};

  var flush = (timeout) => buffer.drain(timeout);

  function send(envelope) {
    var filteredEnvelopeItems = [];

    // Drop rate limited items from envelope
    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.forEachEnvelopeItem)(envelope, (item, type) => {
      var envelopeItemDataCategory = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.envelopeItemTypeToDataCategory)(type);
      if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.isRateLimited)(rateLimits, envelopeItemDataCategory)) {
        options.recordDroppedEvent('ratelimit_backoff', envelopeItemDataCategory);
      } else {
        filteredEnvelopeItems.push(item);
      }
    });

    // Skip sending if envelope is empty after filtering out rate limited events
    if (filteredEnvelopeItems.length === 0) {
      return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.resolvedSyncPromise)();
    }

        var filteredEnvelope = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.createEnvelope)(envelope[0], filteredEnvelopeItems );

    // Creates client report for each item in an envelope
    var recordEnvelopeLoss = (reason) => {
      (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.forEachEnvelopeItem)(filteredEnvelope, (_, type) => {
        options.recordDroppedEvent(reason, (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.envelopeItemTypeToDataCategory)(type));
      });
    };

    var requestTask = () =>
      makeRequest({ body: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.serializeEnvelope)(filteredEnvelope, options.textEncoder) }).then(
        response => {
          // We don't want to throw on NOK responses, but we want to at least log them
          if (response.statusCode !== undefined && (response.statusCode < 200 || response.statusCode >= 300)) {
            (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.warn(`Sentry responded with status code ${response.statusCode} to sent event.`);
          }

          rateLimits = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.updateRateLimits)(rateLimits, response);
        },
        error => {
          (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.error('Failed while sending event:', error);
          recordEnvelopeLoss('network_error');
        },
      );

    return buffer.add(requestTask).then(
      result => result,
      error => {
        if (error instanceof _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.SentryError) {
          (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.error('Skipped sending event because buffer is full.');
          recordEnvelopeLoss('queue_overflow');
          return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.resolvedSyncPromise)();
        } else {
          throw error;
        }
      },
    );
  }

  return {
    send,
    flush,
  };
}


//# sourceMappingURL=base.js.map


/***/ }),

/***/ "./node_modules/@sentry/core/esm/version.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SDK_VERSION": () => (/* binding */ SDK_VERSION)
/* harmony export */ });
var SDK_VERSION = '7.12.1';


//# sourceMappingURL=version.js.map


/***/ }),

/***/ "./node_modules/@sentry/hub/esm/exports.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addBreadcrumb": () => (/* binding */ addBreadcrumb),
/* harmony export */   "captureEvent": () => (/* binding */ captureEvent),
/* harmony export */   "captureException": () => (/* binding */ captureException),
/* harmony export */   "captureMessage": () => (/* binding */ captureMessage),
/* harmony export */   "configureScope": () => (/* binding */ configureScope),
/* harmony export */   "setContext": () => (/* binding */ setContext),
/* harmony export */   "setExtra": () => (/* binding */ setExtra),
/* harmony export */   "setExtras": () => (/* binding */ setExtras),
/* harmony export */   "setTag": () => (/* binding */ setTag),
/* harmony export */   "setTags": () => (/* binding */ setTags),
/* harmony export */   "setUser": () => (/* binding */ setUser),
/* harmony export */   "startTransaction": () => (/* binding */ startTransaction),
/* harmony export */   "withScope": () => (/* binding */ withScope)
/* harmony export */ });
/* harmony import */ var _hub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/hub/esm/hub.js");


// Note: All functions in this file are typed with a return value of `ReturnType<Hub[HUB_FUNCTION]>`,
// where HUB_FUNCTION is some method on the Hub class.
//
// This is done to make sure the top level SDK methods stay in sync with the hub methods.
// Although every method here has an explicit return type, some of them (that map to void returns) do not
// contain `return` keywords. This is done to save on bundle size, as `return` is not minifiable.

/**
 * Captures an exception event and sends it to Sentry.
 *
 * @param exception An exception-like object.
 * @param captureContext Additional scope data to apply to exception event.
 * @returns The generated eventId.
 */
function captureException(exception, captureContext) {
  return (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().captureException(exception, { captureContext });
}

/**
 * Captures a message event and sends it to Sentry.
 *
 * @param message The message to send to Sentry.
 * @param Severity Define the level of the message.
 * @returns The generated eventId.
 */
function captureMessage(
  message,
    captureContext,
) {
  // This is necessary to provide explicit scopes upgrade, without changing the original
  // arity of the `captureMessage(message, level)` method.
  var level = typeof captureContext === 'string' ? captureContext : undefined;
  var context = typeof captureContext !== 'string' ? { captureContext } : undefined;
  return (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().captureMessage(message, level, context);
}

/**
 * Captures a manually created event and sends it to Sentry.
 *
 * @param event The event to send to Sentry.
 * @returns The generated eventId.
 */
function captureEvent(event, hint) {
  return (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().captureEvent(event, hint);
}

/**
 * Callback to set context information onto the scope.
 * @param callback Callback function that receives Scope.
 */
function configureScope(callback) {
  (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().configureScope(callback);
}

/**
 * Records a new breadcrumb which will be attached to future events.
 *
 * Breadcrumbs will be added to subsequent events to provide more context on
 * user's actions prior to an error or crash.
 *
 * @param breadcrumb The breadcrumb to record.
 */
function addBreadcrumb(breadcrumb) {
  (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().addBreadcrumb(breadcrumb);
}

/**
 * Sets context data with the given name.
 * @param name of the context
 * @param context Any kind of data. This data will be normalized.
 */
function setContext(name, context) {
  (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().setContext(name, context);
}

/**
 * Set an object that will be merged sent as extra data with the event.
 * @param extras Extras object to merge into current context.
 */
function setExtras(extras) {
  (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().setExtras(extras);
}

/**
 * Set key:value that will be sent as extra data with the event.
 * @param key String of extra
 * @param extra Any kind of data. This data will be normalized.
 */
function setExtra(key, extra) {
  (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().setExtra(key, extra);
}

/**
 * Set an object that will be merged sent as tags data with the event.
 * @param tags Tags context object to merge into current context.
 */
function setTags(tags) {
  (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().setTags(tags);
}

/**
 * Set key:value that will be sent as tags data with the event.
 *
 * Can also be used to unset a tag, by passing `undefined`.
 *
 * @param key String key of tag
 * @param value Value of tag
 */
function setTag(key, value) {
  (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().setTag(key, value);
}

/**
 * Updates user context information for future events.
 *
 * @param user User context object to be set in the current context. Pass `null` to unset the user.
 */
function setUser(user) {
  (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().setUser(user);
}

/**
 * Creates a new scope with and executes the given operation within.
 * The scope is automatically removed once the operation
 * finishes or throws.
 *
 * This is essentially a convenience function for:
 *
 *     pushScope();
 *     callback();
 *     popScope();
 *
 * @param callback that will be enclosed into push/popScope.
 */
function withScope(callback) {
  (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().withScope(callback);
}

/**
 * Starts a new `Transaction` and returns it. This is the entry point to manual tracing instrumentation.
 *
 * A tree structure can be built by adding child spans to the transaction, and child spans to other spans. To start a
 * new child span within the transaction or any span, call the respective `.startChild()` method.
 *
 * Every child span must be finished before the transaction is finished, otherwise the unfinished spans are discarded.
 *
 * The transaction must be finished with a call to its `.finish()` method, at which point the transaction with all its
 * finished child spans will be sent to Sentry.
 *
 * NOTE: This function should only be used for *manual* instrumentation. Auto-instrumentation should call
 * `startTransaction` directly on the hub.
 *
 * @param context Properties of the new `Transaction`.
 * @param customSamplingContext Information given to the transaction sampling function (along with context-dependent
 * default values). See {@link Options.tracesSampler}.
 *
 * @returns The transaction which was just started
 */
function startTransaction(
  context,
  customSamplingContext,
) {
  return (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().startTransaction(
    {
      metadata: { source: 'custom' },
      ...context,
    },
    customSamplingContext,
  );
}


//# sourceMappingURL=exports.js.map


/***/ }),

/***/ "./node_modules/@sentry/hub/esm/hub.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "API_VERSION": () => (/* binding */ API_VERSION),
/* harmony export */   "Hub": () => (/* binding */ Hub),
/* harmony export */   "getCurrentHub": () => (/* binding */ getCurrentHub),
/* harmony export */   "getHubFromCarrier": () => (/* binding */ getHubFromCarrier),
/* harmony export */   "getMainCarrier": () => (/* binding */ getMainCarrier),
/* harmony export */   "makeMain": () => (/* binding */ makeMain),
/* harmony export */   "setHubOnCarrier": () => (/* binding */ setHubOnCarrier)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/misc.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/utils/esm/time.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/utils/esm/global.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@sentry/utils/esm/node.js");
/* harmony import */ var _scope_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/hub/esm/scope.js");
/* harmony import */ var _session_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/hub/esm/session.js");




/**
 * API compatibility version of this hub.
 *
 * WARNING: This number should only be increased when the global interface
 * changes and new methods are introduced.
 *
 * @hidden
 */
var API_VERSION = 4;

/**
 * Default maximum number of breadcrumbs added to an event. Can be overwritten
 * with {@link Options.maxBreadcrumbs}.
 */
var DEFAULT_BREADCRUMBS = 100;

/**
 * A layer in the process stack.
 * @hidden
 */

/**
 * @inheritDoc
 */
class Hub  {
  /** Is a {@link Layer}[] containing the client and scope */
    __init() {this._stack = [{}];}

  /** Contains the last event id of a captured event.  */
  

  /**
   * Creates a new instance of the hub, will push one {@link Layer} into the
   * internal stack on creation.
   *
   * @param client bound to the hub.
   * @param scope bound to the hub.
   * @param version number, higher number means higher priority.
   */
   constructor(client, scope = new _scope_js__WEBPACK_IMPORTED_MODULE_0__.Scope(),   _version = API_VERSION) {;this._version = _version;Hub.prototype.__init.call(this);
    this.getStackTop().scope = scope;
    if (client) {
      this.bindClient(client);
    }
  }

  /**
   * @inheritDoc
   */
   isOlderThan(version) {
    return this._version < version;
  }

  /**
   * @inheritDoc
   */
   bindClient(client) {
    var top = this.getStackTop();
    top.client = client;
    if (client && client.setupIntegrations) {
      client.setupIntegrations();
    }
  }

  /**
   * @inheritDoc
   */
   pushScope() {
    // We want to clone the content of prev scope
    var scope = _scope_js__WEBPACK_IMPORTED_MODULE_0__.Scope.clone(this.getScope());
    this.getStack().push({
      client: this.getClient(),
      scope,
    });
    return scope;
  }

  /**
   * @inheritDoc
   */
   popScope() {
    if (this.getStack().length <= 1) return false;
    return !!this.getStack().pop();
  }

  /**
   * @inheritDoc
   */
   withScope(callback) {
    var scope = this.pushScope();
    try {
      callback(scope);
    } finally {
      this.popScope();
    }
  }

  /**
   * @inheritDoc
   */
   getClient() {
    return this.getStackTop().client ;
  }

  /** Returns the scope of the top stack. */
   getScope() {
    return this.getStackTop().scope;
  }

  /** Returns the scope stack for domains or the process. */
   getStack() {
    return this._stack;
  }

  /** Returns the topmost scope layer in the order domain > local > process. */
   getStackTop() {
    return this._stack[this._stack.length - 1];
  }

  /**
   * @inheritDoc
   */
     captureException(exception, hint) {
    var eventId = (this._lastEventId = hint && hint.event_id ? hint.event_id : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.uuid4)());
    var syntheticException = new Error('Sentry syntheticException');
    this._withClient((client, scope) => {
      client.captureException(
        exception,
        {
          originalException: exception,
          syntheticException,
          ...hint,
          event_id: eventId,
        },
        scope,
      );
    });
    return eventId;
  }

  /**
   * @inheritDoc
   */
   captureMessage(
    message,
        level,
    hint,
  ) {
    var eventId = (this._lastEventId = hint && hint.event_id ? hint.event_id : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.uuid4)());
    var syntheticException = new Error(message);
    this._withClient((client, scope) => {
      client.captureMessage(
        message,
        level,
        {
          originalException: message,
          syntheticException,
          ...hint,
          event_id: eventId,
        },
        scope,
      );
    });
    return eventId;
  }

  /**
   * @inheritDoc
   */
   captureEvent(event, hint) {
    var eventId = hint && hint.event_id ? hint.event_id : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.uuid4)();
    if (event.type !== 'transaction') {
      this._lastEventId = eventId;
    }

    this._withClient((client, scope) => {
      client.captureEvent(event, { ...hint, event_id: eventId }, scope);
    });
    return eventId;
  }

  /**
   * @inheritDoc
   */
   lastEventId() {
    return this._lastEventId;
  }

  /**
   * @inheritDoc
   */
   addBreadcrumb(breadcrumb, hint) {
    const { scope, client } = this.getStackTop();

    if (!scope || !client) return;

        const { beforeBreadcrumb = null, maxBreadcrumbs = DEFAULT_BREADCRUMBS } =
      (client.getOptions && client.getOptions()) || {};

    if (maxBreadcrumbs <= 0) return;

    var timestamp = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.dateTimestampInSeconds)();
    var mergedBreadcrumb = { timestamp, ...breadcrumb };
    var finalBreadcrumb = beforeBreadcrumb
      ? ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.consoleSandbox)(() => beforeBreadcrumb(mergedBreadcrumb, hint)) )
      : mergedBreadcrumb;

    if (finalBreadcrumb === null) return;

    scope.addBreadcrumb(finalBreadcrumb, maxBreadcrumbs);
  }

  /**
   * @inheritDoc
   */
   setUser(user) {
    var scope = this.getScope();
    if (scope) scope.setUser(user);
  }

  /**
   * @inheritDoc
   */
   setTags(tags) {
    var scope = this.getScope();
    if (scope) scope.setTags(tags);
  }

  /**
   * @inheritDoc
   */
   setExtras(extras) {
    var scope = this.getScope();
    if (scope) scope.setExtras(extras);
  }

  /**
   * @inheritDoc
   */
   setTag(key, value) {
    var scope = this.getScope();
    if (scope) scope.setTag(key, value);
  }

  /**
   * @inheritDoc
   */
   setExtra(key, extra) {
    var scope = this.getScope();
    if (scope) scope.setExtra(key, extra);
  }

  /**
   * @inheritDoc
   */
     setContext(name, context) {
    var scope = this.getScope();
    if (scope) scope.setContext(name, context);
  }

  /**
   * @inheritDoc
   */
   configureScope(callback) {
    const { scope, client } = this.getStackTop();
    if (scope && client) {
      callback(scope);
    }
  }

  /**
   * @inheritDoc
   */
   run(callback) {
    var oldHub = makeMain(this);
    try {
      callback(this);
    } finally {
      makeMain(oldHub);
    }
  }

  /**
   * @inheritDoc
   */
   getIntegration(integration) {
    var client = this.getClient();
    if (!client) return null;
    try {
      return client.getIntegration(integration);
    } catch (_oO) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.warn(`Cannot retrieve integration ${integration.id} from the current Hub`);
      return null;
    }
  }

  /**
   * @inheritDoc
   */
   startTransaction(context, customSamplingContext) {
    return this._callExtensionMethod('startTransaction', context, customSamplingContext);
  }

  /**
   * @inheritDoc
   */
   traceHeaders() {
    return this._callExtensionMethod('traceHeaders');
  }

  /**
   * @inheritDoc
   */
   captureSession(endSession = false) {
    // both send the update and pull the session from the scope
    if (endSession) {
      return this.endSession();
    }

    // only send the update
    this._sendSessionUpdate();
  }

  /**
   * @inheritDoc
   */
   endSession() {
    var layer = this.getStackTop();
    var scope = layer && layer.scope;
    var session = scope && scope.getSession();
    if (session) {
      (0,_session_js__WEBPACK_IMPORTED_MODULE_4__.closeSession)(session);
    }
    this._sendSessionUpdate();

    // the session is over; take it off of the scope
    if (scope) {
      scope.setSession();
    }
  }

  /**
   * @inheritDoc
   */
   startSession(context) {
    const { scope, client } = this.getStackTop();
    const { release, environment } = (client && client.getOptions()) || {};

    // Will fetch userAgent if called from browser sdk
    var global = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.getGlobalObject)();
    const { userAgent } = global.navigator || {};

    var session = (0,_session_js__WEBPACK_IMPORTED_MODULE_4__.makeSession)({
      release,
      environment,
      ...(scope && { user: scope.getUser() }),
      ...(userAgent && { userAgent }),
      ...context,
    });

    if (scope) {
      // End existing session if there's one
      var currentSession = scope.getSession && scope.getSession();
      if (currentSession && currentSession.status === 'ok') {
        (0,_session_js__WEBPACK_IMPORTED_MODULE_4__.updateSession)(currentSession, { status: 'exited' });
      }
      this.endSession();

      // Afterwards we set the new session on the scope
      scope.setSession(session);
    }

    return session;
  }

  /**
   * Returns if default PII should be sent to Sentry and propagated in ourgoing requests
   * when Tracing is used.
   */
   shouldSendDefaultPii() {
    var client = this.getClient();
    var options = client && client.getOptions();
    return Boolean(options && options.sendDefaultPii);
  }

  /**
   * Sends the current Session on the scope
   */
   _sendSessionUpdate() {
    const { scope, client } = this.getStackTop();
    if (!scope) return;

    var session = scope.getSession();
    if (session) {
      if (client && client.captureSession) {
        client.captureSession(session);
      }
    }
  }

  /**
   * Internal helper function to call a method on the top client if it exists.
   *
   * @param method The method to call on the client.
   * @param args Arguments to pass to the client function.
   */
   _withClient(callback) {
    const { scope, client } = this.getStackTop();
    if (client) {
      callback(client, scope);
    }
  }

  /**
   * Calls global extension method and binding current instance to the function call
   */
  // @ts-ignore Function lacks ending return statement and return type does not include 'undefined'. ts(2366)
     _callExtensionMethod(method, ...args) {
    var carrier = getMainCarrier();
    var sentry = carrier.__SENTRY__;
    if (sentry && sentry.extensions && typeof sentry.extensions[method] === 'function') {
      return sentry.extensions[method].apply(this, args);
    }
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.warn(`Extension method ${method} couldn't be found, doing nothing.`);
  }
}

/**
 * Returns the global shim registry.
 *
 * FIXME: This function is problematic, because despite always returning a valid Carrier,
 * it has an optional `__SENTRY__` property, which then in turn requires us to always perform an unnecessary check
 * at the call-site. We always access the carrier through this function, so we can guarantee that `__SENTRY__` is there.
 **/
function getMainCarrier() {
  var carrier = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.getGlobalObject)();
  carrier.__SENTRY__ = carrier.__SENTRY__ || {
    extensions: {},
    hub: undefined,
  };
  return carrier;
}

/**
 * Replaces the current main hub with the passed one on the global object
 *
 * @returns The old replaced hub
 */
function makeMain(hub) {
  var registry = getMainCarrier();
  var oldHub = getHubFromCarrier(registry);
  setHubOnCarrier(registry, hub);
  return oldHub;
}

/**
 * Returns the default hub instance.
 *
 * If a hub is already registered in the global carrier but this module
 * contains a more recent version, it replaces the registered version.
 * Otherwise, the currently registered hub will be returned.
 */
function getCurrentHub() {
  // Get main carrier (global for every environment)
  var registry = getMainCarrier();

  // If there's no hub, or its an old API, assign a new one
  if (!hasHubOnCarrier(registry) || getHubFromCarrier(registry).isOlderThan(API_VERSION)) {
    setHubOnCarrier(registry, new Hub());
  }

  // Prefer domains over global if they are there (applicable only to Node environment)
  if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.isNodeEnv)()) {
    return getHubFromActiveDomain(registry);
  }
  // Return hub that lives on a global object
  return getHubFromCarrier(registry);
}

/**
 * Try to read the hub from an active domain, and fallback to the registry if one doesn't exist
 * @returns discovered hub
 */
function getHubFromActiveDomain(registry) {
  try {
    var sentry = getMainCarrier().__SENTRY__;
    var activeDomain = sentry && sentry.extensions && sentry.extensions.domain && sentry.extensions.domain.active;

    // If there's no active domain, just return global hub
    if (!activeDomain) {
      return getHubFromCarrier(registry);
    }

    // If there's no hub on current domain, or it's an old API, assign a new one
    if (!hasHubOnCarrier(activeDomain) || getHubFromCarrier(activeDomain).isOlderThan(API_VERSION)) {
      var registryHubTopStack = getHubFromCarrier(registry).getStackTop();
      setHubOnCarrier(activeDomain, new Hub(registryHubTopStack.client, _scope_js__WEBPACK_IMPORTED_MODULE_0__.Scope.clone(registryHubTopStack.scope)));
    }

    // Return hub that lives on a domain
    return getHubFromCarrier(activeDomain);
  } catch (_Oo) {
    // Return hub that lives on a global object
    return getHubFromCarrier(registry);
  }
}

/**
 * This will tell whether a carrier has a hub on it or not
 * @param carrier object
 */
function hasHubOnCarrier(carrier) {
  return !!(carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub);
}

/**
 * This will create a new {@link Hub} and add to the passed object on
 * __SENTRY__.hub.
 * @param carrier object
 * @hidden
 */
function getHubFromCarrier(carrier) {
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.getGlobalSingleton)('hub', () => new Hub(), carrier);
}

/**
 * This will set passed {@link Hub} on the passed object's __SENTRY__.hub attribute
 * @param carrier object
 * @param hub Hub
 * @returns A boolean indicating success or failure
 */
function setHubOnCarrier(carrier, hub) {
  if (!carrier) return false;
  var __SENTRY__ = (carrier.__SENTRY__ = carrier.__SENTRY__ || {});
  __SENTRY__.hub = hub;
  return true;
}


//# sourceMappingURL=hub.js.map


/***/ }),

/***/ "./node_modules/@sentry/hub/esm/scope.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Scope": () => (/* binding */ Scope),
/* harmony export */   "addGlobalEventProcessor": () => (/* binding */ addGlobalEventProcessor)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/is.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/utils/esm/time.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/utils/esm/syncpromise.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/utils/esm/misc.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@sentry/utils/esm/global.js");
/* harmony import */ var _session_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/hub/esm/session.js");



/**
 * Absolute maximum number of breadcrumbs added to an event.
 * The `maxBreadcrumbs` option cannot be higher than this value.
 */
var MAX_BREADCRUMBS = 100;

/**
 * Holds additional event information. {@link Scope.applyToEvent} will be
 * called by the client before an event will be sent.
 */
class Scope  {
  /** Flag if notifying is happening. */
  

  /** Callback for client to receive scope changes. */
  

  /** Callback list that will be called after {@link applyToEvent}. */
  

  /** Array of breadcrumbs. */
  

  /** User */
  

  /** Tags */
  

  /** Extra */
  

  /** Contexts */
  

  /** Attachments */
  

  /**
   * A place to stash data which is needed at some point in the SDK's event processing pipeline but which shouldn't get
   * sent to Sentry
   */
  

  /** Fingerprint */
  

  /** Severity */
    

  /** Transaction Name */
  

  /** Span */
  

  /** Session */
  

  /** Request Mode Session Status */
  

   constructor() {
    this._notifyingListeners = false;
    this._scopeListeners = [];
    this._eventProcessors = [];
    this._breadcrumbs = [];
    this._attachments = [];
    this._user = {};
    this._tags = {};
    this._extra = {};
    this._contexts = {};
    this._sdkProcessingMetadata = {};
  }

  /**
   * Inherit values from the parent scope.
   * @param scope to clone.
   */
   static clone(scope) {
    var newScope = new Scope();
    if (scope) {
      newScope._breadcrumbs = [...scope._breadcrumbs];
      newScope._tags = { ...scope._tags };
      newScope._extra = { ...scope._extra };
      newScope._contexts = { ...scope._contexts };
      newScope._user = scope._user;
      newScope._level = scope._level;
      newScope._span = scope._span;
      newScope._session = scope._session;
      newScope._transactionName = scope._transactionName;
      newScope._fingerprint = scope._fingerprint;
      newScope._eventProcessors = [...scope._eventProcessors];
      newScope._requestSession = scope._requestSession;
      newScope._attachments = [...scope._attachments];
    }
    return newScope;
  }

  /**
   * Add internal on change listener. Used for sub SDKs that need to store the scope.
   * @hidden
   */
   addScopeListener(callback) {
    this._scopeListeners.push(callback);
  }

  /**
   * @inheritDoc
   */
   addEventProcessor(callback) {
    this._eventProcessors.push(callback);
    return this;
  }

  /**
   * @inheritDoc
   */
   setUser(user) {
    this._user = user || {};
    if (this._session) {
      (0,_session_js__WEBPACK_IMPORTED_MODULE_0__.updateSession)(this._session, { user });
    }
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   getUser() {
    return this._user;
  }

  /**
   * @inheritDoc
   */
   getRequestSession() {
    return this._requestSession;
  }

  /**
   * @inheritDoc
   */
   setRequestSession(requestSession) {
    this._requestSession = requestSession;
    return this;
  }

  /**
   * @inheritDoc
   */
   setTags(tags) {
    this._tags = {
      ...this._tags,
      ...tags,
    };
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setTag(key, value) {
    this._tags = { ...this._tags, [key]: value };
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setExtras(extras) {
    this._extra = {
      ...this._extra,
      ...extras,
    };
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setExtra(key, extra) {
    this._extra = { ...this._extra, [key]: extra };
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setFingerprint(fingerprint) {
    this._fingerprint = fingerprint;
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setLevel(
        level,
  ) {
    this._level = level;
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setTransactionName(name) {
    this._transactionName = name;
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setContext(key, context) {
    if (context === null) {
            delete this._contexts[key];
    } else {
      this._contexts = { ...this._contexts, [key]: context };
    }

    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setSpan(span) {
    this._span = span;
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   getSpan() {
    return this._span;
  }

  /**
   * @inheritDoc
   */
   getTransaction() {
    // Often, this span (if it exists at all) will be a transaction, but it's not guaranteed to be. Regardless, it will
    // have a pointer to the currently-active transaction.
    var span = this.getSpan();
    return span && span.transaction;
  }

  /**
   * @inheritDoc
   */
   setSession(session) {
    if (!session) {
      delete this._session;
    } else {
      this._session = session;
    }
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   getSession() {
    return this._session;
  }

  /**
   * @inheritDoc
   */
   update(captureContext) {
    if (!captureContext) {
      return this;
    }

    if (typeof captureContext === 'function') {
      var updatedScope = (captureContext )(this);
      return updatedScope instanceof Scope ? updatedScope : this;
    }

    if (captureContext instanceof Scope) {
      this._tags = { ...this._tags, ...captureContext._tags };
      this._extra = { ...this._extra, ...captureContext._extra };
      this._contexts = { ...this._contexts, ...captureContext._contexts };
      if (captureContext._user && Object.keys(captureContext._user).length) {
        this._user = captureContext._user;
      }
      if (captureContext._level) {
        this._level = captureContext._level;
      }
      if (captureContext._fingerprint) {
        this._fingerprint = captureContext._fingerprint;
      }
      if (captureContext._requestSession) {
        this._requestSession = captureContext._requestSession;
      }
    } else if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(captureContext)) {
            captureContext = captureContext ;
      this._tags = { ...this._tags, ...captureContext.tags };
      this._extra = { ...this._extra, ...captureContext.extra };
      this._contexts = { ...this._contexts, ...captureContext.contexts };
      if (captureContext.user) {
        this._user = captureContext.user;
      }
      if (captureContext.level) {
        this._level = captureContext.level;
      }
      if (captureContext.fingerprint) {
        this._fingerprint = captureContext.fingerprint;
      }
      if (captureContext.requestSession) {
        this._requestSession = captureContext.requestSession;
      }
    }

    return this;
  }

  /**
   * @inheritDoc
   */
   clear() {
    this._breadcrumbs = [];
    this._tags = {};
    this._extra = {};
    this._user = {};
    this._contexts = {};
    this._level = undefined;
    this._transactionName = undefined;
    this._fingerprint = undefined;
    this._requestSession = undefined;
    this._span = undefined;
    this._session = undefined;
    this._notifyScopeListeners();
    this._attachments = [];
    return this;
  }

  /**
   * @inheritDoc
   */
   addBreadcrumb(breadcrumb, maxBreadcrumbs) {
    var maxCrumbs = typeof maxBreadcrumbs === 'number' ? Math.min(maxBreadcrumbs, MAX_BREADCRUMBS) : MAX_BREADCRUMBS;

    // No data has been changed, so don't notify scope listeners
    if (maxCrumbs <= 0) {
      return this;
    }

    var mergedBreadcrumb = {
      timestamp: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.dateTimestampInSeconds)(),
      ...breadcrumb,
    };
    this._breadcrumbs = [...this._breadcrumbs, mergedBreadcrumb].slice(-maxCrumbs);
    this._notifyScopeListeners();

    return this;
  }

  /**
   * @inheritDoc
   */
   clearBreadcrumbs() {
    this._breadcrumbs = [];
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   addAttachment(attachment) {
    this._attachments.push(attachment);
    return this;
  }

  /**
   * @inheritDoc
   */
   getAttachments() {
    return this._attachments;
  }

  /**
   * @inheritDoc
   */
   clearAttachments() {
    this._attachments = [];
    return this;
  }

  /**
   * Applies data from the scope to the event and runs all event processors on it.
   *
   * @param event Event
   * @param hint Object containing additional information about the original exception, for use by the event processors.
   * @hidden
   */
   applyToEvent(event, hint = {}) {
    if (this._extra && Object.keys(this._extra).length) {
      event.extra = { ...this._extra, ...event.extra };
    }
    if (this._tags && Object.keys(this._tags).length) {
      event.tags = { ...this._tags, ...event.tags };
    }
    if (this._user && Object.keys(this._user).length) {
      event.user = { ...this._user, ...event.user };
    }
    if (this._contexts && Object.keys(this._contexts).length) {
      event.contexts = { ...this._contexts, ...event.contexts };
    }
    if (this._level) {
      event.level = this._level;
    }
    if (this._transactionName) {
      event.transaction = this._transactionName;
    }

    // We want to set the trace context for normal events only if there isn't already
    // a trace context on the event. There is a product feature in place where we link
    // errors with transaction and it relies on that.
    if (this._span) {
      event.contexts = { trace: this._span.getTraceContext(), ...event.contexts };
      var transactionName = this._span.transaction && this._span.transaction.name;
      if (transactionName) {
        event.tags = { transaction: transactionName, ...event.tags };
      }
    }

    this._applyFingerprint(event);

    event.breadcrumbs = [...(event.breadcrumbs || []), ...this._breadcrumbs];
    event.breadcrumbs = event.breadcrumbs.length > 0 ? event.breadcrumbs : undefined;

    event.sdkProcessingMetadata = { ...event.sdkProcessingMetadata, ...this._sdkProcessingMetadata };

    return this._notifyEventProcessors([...getGlobalEventProcessors(), ...this._eventProcessors], event, hint);
  }

  /**
   * Add data which will be accessible during event processing but won't get sent to Sentry
   */
   setSDKProcessingMetadata(newData) {
    this._sdkProcessingMetadata = { ...this._sdkProcessingMetadata, ...newData };

    return this;
  }

  /**
   * This will be called after {@link applyToEvent} is finished.
   */
   _notifyEventProcessors(
    processors,
    event,
    hint,
    index = 0,
  ) {
    return new _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.SyncPromise((resolve, reject) => {
      var processor = processors[index];
      if (event === null || typeof processor !== 'function') {
        resolve(event);
      } else {
        var result = processor({ ...event }, hint) ;

        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
          processor.id &&
          result === null &&
          _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.log(`Event processor "${processor.id}" dropped event`);

        if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.isThenable)(result)) {
          void result
            .then(final => this._notifyEventProcessors(processors, final, hint, index + 1).then(resolve))
            .then(null, reject);
        } else {
          void this._notifyEventProcessors(processors, result, hint, index + 1)
            .then(resolve)
            .then(null, reject);
        }
      }
    });
  }

  /**
   * This will be called on every set call.
   */
   _notifyScopeListeners() {
    // We need this check for this._notifyingListeners to be able to work on scope during updates
    // If this check is not here we'll produce endless recursion when something is done with the scope
    // during the callback.
    if (!this._notifyingListeners) {
      this._notifyingListeners = true;
      this._scopeListeners.forEach(callback => {
        callback(this);
      });
      this._notifyingListeners = false;
    }
  }

  /**
   * Applies fingerprint from the scope to the event if there's one,
   * uses message if there's one instead or get rid of empty fingerprint
   */
   _applyFingerprint(event) {
    // Make sure it's an array first and we actually have something in place
    event.fingerprint = event.fingerprint ? (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.arrayify)(event.fingerprint) : [];

    // If we have something on the scope, then merge it with event
    if (this._fingerprint) {
      event.fingerprint = event.fingerprint.concat(this._fingerprint);
    }

    // If we have no data at all, remove empty array default
    if (event.fingerprint && !event.fingerprint.length) {
      delete event.fingerprint;
    }
  }
}

/**
 * Returns the global event processors.
 */
function getGlobalEventProcessors() {
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.getGlobalSingleton)('globalEventProcessors', () => []);
}

/**
 * Add a EventProcessor to be kept globally.
 * @param callback EventProcessor to add
 */
function addGlobalEventProcessor(callback) {
  getGlobalEventProcessors().push(callback);
}


//# sourceMappingURL=scope.js.map


/***/ }),

/***/ "./node_modules/@sentry/hub/esm/session.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "closeSession": () => (/* binding */ closeSession),
/* harmony export */   "makeSession": () => (/* binding */ makeSession),
/* harmony export */   "updateSession": () => (/* binding */ updateSession)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/time.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/misc.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/utils/esm/object.js");


/**
 * Creates a new `Session` object by setting certain default parameters. If optional @param context
 * is passed, the passed properties are applied to the session object.
 *
 * @param context (optional) additional properties to be applied to the returned session object
 *
 * @returns a new `Session` object
 */
function makeSession(context) {
  // Both timestamp and started are in seconds since the UNIX epoch.
  var startingTime = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.timestampInSeconds)();

  var session = {
    sid: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.uuid4)(),
    init: true,
    timestamp: startingTime,
    started: startingTime,
    duration: 0,
    status: 'ok',
    errors: 0,
    ignoreDuration: false,
    toJSON: () => sessionToJSON(session),
  };

  if (context) {
    updateSession(session, context);
  }

  return session;
}

/**
 * Updates a session object with the properties passed in the context.
 *
 * Note that this function mutates the passed object and returns void.
 * (Had to do this instead of returning a new and updated session because closing and sending a session
 * makes an update to the session after it was passed to the sending logic.
 * @see BaseClient.captureSession )
 *
 * @param session the `Session` to update
 * @param context the `SessionContext` holding the properties that should be updated in @param session
 */
function updateSession(session, context = {}) {
  if (context.user) {
    if (!session.ipAddress && context.user.ip_address) {
      session.ipAddress = context.user.ip_address;
    }

    if (!session.did && !context.did) {
      session.did = context.user.id || context.user.email || context.user.username;
    }
  }

  session.timestamp = context.timestamp || (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.timestampInSeconds)();

  if (context.ignoreDuration) {
    session.ignoreDuration = context.ignoreDuration;
  }
  if (context.sid) {
    // Good enough uuid validation. — Kamil
    session.sid = context.sid.length === 32 ? context.sid : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.uuid4)();
  }
  if (context.init !== undefined) {
    session.init = context.init;
  }
  if (!session.did && context.did) {
    session.did = `${context.did}`;
  }
  if (typeof context.started === 'number') {
    session.started = context.started;
  }
  if (session.ignoreDuration) {
    session.duration = undefined;
  } else if (typeof context.duration === 'number') {
    session.duration = context.duration;
  } else {
    var duration = session.timestamp - session.started;
    session.duration = duration >= 0 ? duration : 0;
  }
  if (context.release) {
    session.release = context.release;
  }
  if (context.environment) {
    session.environment = context.environment;
  }
  if (!session.ipAddress && context.ipAddress) {
    session.ipAddress = context.ipAddress;
  }
  if (!session.userAgent && context.userAgent) {
    session.userAgent = context.userAgent;
  }
  if (typeof context.errors === 'number') {
    session.errors = context.errors;
  }
  if (context.status) {
    session.status = context.status;
  }
}

/**
 * Closes a session by setting its status and updating the session object with it.
 * Internally calls `updateSession` to update the passed session object.
 *
 * Note that this function mutates the passed session (@see updateSession for explanation).
 *
 * @param session the `Session` object to be closed
 * @param status the `SessionStatus` with which the session was closed. If you don't pass a status,
 *               this function will keep the previously set status, unless it was `'ok'` in which case
 *               it is changed to `'exited'`.
 */
function closeSession(session, status) {
  let context = {};
  if (status) {
    context = { status };
  } else if (session.status === 'ok') {
    context = { status: 'exited' };
  }

  updateSession(session, context);
}

/**
 * Serializes a passed session object to a JSON object with a slightly different structure.
 * This is necessary because the Sentry backend requires a slightly different schema of a session
 * than the one the JS SDKs use internally.
 *
 * @param session the session to be converted
 *
 * @returns a JSON object of the passed session
 */
function sessionToJSON(session) {
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.dropUndefinedKeys)({
    sid: `${session.sid}`,
    init: session.init,
    // Make sure that sec is converted to ms for date constructor
    started: new Date(session.started * 1000).toISOString(),
    timestamp: new Date(session.timestamp * 1000).toISOString(),
    status: session.status,
    errors: session.errors,
    did: typeof session.did === 'number' || typeof session.did === 'string' ? `${session.did}` : undefined,
    duration: session.duration,
    attrs: {
      release: session.release,
      environment: session.environment,
      ip_address: session.ipAddress,
      user_agent: session.userAgent,
    },
  });
}


//# sourceMappingURL=session.js.map


/***/ }),

/***/ "./node_modules/@sentry/hub/esm/sessionflusher.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SessionFlusher": () => (/* binding */ SessionFlusher)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/object.js");
/* harmony import */ var _hub_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/hub/esm/hub.js");



/**
 * @inheritdoc
 */
class SessionFlusher  {
    __init() {this.flushTimeout = 60;}
   __init2() {this._pendingAggregates = {};}
  
  
   __init3() {this._isEnabled = true;}
  

   constructor(client, attrs) {;SessionFlusher.prototype.__init.call(this);SessionFlusher.prototype.__init2.call(this);SessionFlusher.prototype.__init3.call(this);
    this._client = client;
    // Call to setInterval, so that flush is called every 60 seconds
    this._intervalId = setInterval(() => this.flush(), this.flushTimeout * 1000);
    this._sessionAttrs = attrs;
  }

  /** Checks if `pendingAggregates` has entries, and if it does flushes them by calling `sendSession` */
   flush() {
    var sessionAggregates = this.getSessionAggregates();
    if (sessionAggregates.aggregates.length === 0) {
      return;
    }
    this._pendingAggregates = {};
    this._client.sendSession(sessionAggregates);
  }

  /** Massages the entries in `pendingAggregates` and returns aggregated sessions */
   getSessionAggregates() {
    var aggregates = Object.keys(this._pendingAggregates).map((key) => {
      return this._pendingAggregates[parseInt(key)];
    });

    var sessionAggregates = {
      attrs: this._sessionAttrs,
      aggregates,
    };
    return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.dropUndefinedKeys)(sessionAggregates);
  }

  /** JSDoc */
   close() {
    clearInterval(this._intervalId);
    this._isEnabled = false;
    this.flush();
  }

  /**
   * Wrapper function for _incrementSessionStatusCount that checks if the instance of SessionFlusher is enabled then
   * fetches the session status of the request from `Scope.getRequestSession().status` on the scope and passes them to
   * `_incrementSessionStatusCount` along with the start date
   */
   incrementSessionStatusCount() {
    if (!this._isEnabled) {
      return;
    }
    var scope = (0,_hub_js__WEBPACK_IMPORTED_MODULE_1__.getCurrentHub)().getScope();
    var requestSession = scope && scope.getRequestSession();

    if (requestSession && requestSession.status) {
      this._incrementSessionStatusCount(requestSession.status, new Date());
      // This is not entirely necessarily but is added as a safe guard to indicate the bounds of a request and so in
      // case captureRequestSession is called more than once to prevent double count
      if (scope) {
        scope.setRequestSession(undefined);
      }
          }
  }

  /**
   * Increments status bucket in pendingAggregates buffer (internal state) corresponding to status of
   * the session received
   */
   _incrementSessionStatusCount(status, date) {
    // Truncate minutes and seconds on Session Started attribute to have one minute bucket keys
    var sessionStartedTrunc = new Date(date).setSeconds(0, 0);
    this._pendingAggregates[sessionStartedTrunc] = this._pendingAggregates[sessionStartedTrunc] || {};

    // corresponds to aggregated sessions in one specific minute bucket
    // for example, {"started":"2021-03-16T08:00:00.000Z","exited":4, "errored": 1}
    var aggregationCounts = this._pendingAggregates[sessionStartedTrunc];
    if (!aggregationCounts.started) {
      aggregationCounts.started = new Date(sessionStartedTrunc).toISOString();
    }

    switch (status) {
      case 'errored':
        aggregationCounts.errored = (aggregationCounts.errored || 0) + 1;
        return aggregationCounts.errored;
      case 'ok':
        aggregationCounts.exited = (aggregationCounts.exited || 0) + 1;
        return aggregationCounts.exited;
      default:
        aggregationCounts.crashed = (aggregationCounts.crashed || 0) + 1;
        return aggregationCounts.crashed;
    }
  }
}


//# sourceMappingURL=sessionflusher.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/client.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NodeClient": () => (/* binding */ NodeClient)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/core/esm/baseclient.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/core/esm/version.js");
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/@sentry/hub/esm/sessionflusher.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/@sentry/utils/esm/syncpromise.js");
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("os");
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("util");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _eventbuilder_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/node/esm/eventbuilder.js");








/**
 * The Sentry Node SDK Client.
 *
 * @see NodeClientOptions for documentation on configuration options.
 * @see SentryClient for usage documentation.
 */
class NodeClient extends _sentry_core__WEBPACK_IMPORTED_MODULE_3__.BaseClient {
  

  /**
   * Creates a new Node SDK instance.
   * @param options Configuration options for this SDK.
   */
   constructor(options) {
    options._metadata = options._metadata || {};
    options._metadata.sdk = options._metadata.sdk || {
      name: 'sentry.javascript.node',
      packages: [
        {
          name: 'npm:@sentry/node',
          version: _sentry_core__WEBPACK_IMPORTED_MODULE_4__.SDK_VERSION,
        },
      ],
      version: _sentry_core__WEBPACK_IMPORTED_MODULE_4__.SDK_VERSION,
    };

    // Until node supports global TextEncoder in all versions we support, we are forced to pass it from util
    options.transportOptions = {
      textEncoder: new util__WEBPACK_IMPORTED_MODULE_1__.TextEncoder(),
      ...options.transportOptions,
    };

    super(options);
  }

  /**
   * @inheritDoc
   */
     captureException(exception, hint, scope) {
    // Check if the flag `autoSessionTracking` is enabled, and if `_sessionFlusher` exists because it is initialised only
    // when the `requestHandler` middleware is used, and hence the expectation is to have SessionAggregates payload
    // sent to the Server only when the `requestHandler` middleware is used
    if (this._options.autoSessionTracking && this._sessionFlusher && scope) {
      var requestSession = scope.getRequestSession();

      // Necessary checks to ensure this is code block is executed only within a request
      // Should override the status only if `requestSession.status` is `Ok`, which is its initial stage
      if (requestSession && requestSession.status === 'ok') {
        requestSession.status = 'errored';
      }
    }

    return super.captureException(exception, hint, scope);
  }

  /**
   * @inheritDoc
   */
   captureEvent(event, hint, scope) {
    // Check if the flag `autoSessionTracking` is enabled, and if `_sessionFlusher` exists because it is initialised only
    // when the `requestHandler` middleware is used, and hence the expectation is to have SessionAggregates payload
    // sent to the Server only when the `requestHandler` middleware is used
    if (this._options.autoSessionTracking && this._sessionFlusher && scope) {
      var eventType = event.type || 'exception';
      var isException =
        eventType === 'exception' && event.exception && event.exception.values && event.exception.values.length > 0;

      // If the event is of type Exception, then a request session should be captured
      if (isException) {
        var requestSession = scope.getRequestSession();

        // Ensure that this is happening within the bounds of a request, and make sure not to override
        // Session Status if Errored / Crashed
        if (requestSession && requestSession.status === 'ok') {
          requestSession.status = 'errored';
        }
      }
    }

    return super.captureEvent(event, hint, scope);
  }

  /**
   *
   * @inheritdoc
   */
   close(timeout) {
    (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__._optionalChain)([this, 'access', _ => _._sessionFlusher, 'optionalAccess', _2 => _2.close, 'call', _3 => _3()]);
    return super.close(timeout);
  }

  /** Method that initialises an instance of SessionFlusher on Client */
   initSessionFlusher() {
    const { release, environment } = this._options;
    if (!release) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_6__.logger.warn('Cannot initialise an instance of SessionFlusher if no release is provided!');
    } else {
      this._sessionFlusher = new _sentry_hub__WEBPACK_IMPORTED_MODULE_7__.SessionFlusher(this, {
        release,
        environment,
      });
    }
  }

  /**
   * @inheritDoc
   */
     eventFromException(exception, hint) {
    return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_8__.resolvedSyncPromise)((0,_eventbuilder_js__WEBPACK_IMPORTED_MODULE_2__.eventFromUnknownInput)(this._options.stackParser, exception, hint));
  }

  /**
   * @inheritDoc
   */
   eventFromMessage(
    message,
        level = 'info',
    hint,
  ) {
    return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_8__.resolvedSyncPromise)(
      (0,_eventbuilder_js__WEBPACK_IMPORTED_MODULE_2__.eventFromMessage)(this._options.stackParser, message, level, hint, this._options.attachStacktrace),
    );
  }

  /**
   * @inheritDoc
   */
   _prepareEvent(event, hint, scope) {
    event.platform = event.platform || 'node';
    event.contexts = {
      ...event.contexts,
      runtime: (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__._optionalChain)([event, 'access', _4 => _4.contexts, 'optionalAccess', _5 => _5.runtime]) || {
        name: 'node',
        version: global.process.version,
      },
    };
    event.server_name =
      event.server_name || this.getOptions().serverName || global.process.env.SENTRY_NAME || os__WEBPACK_IMPORTED_MODULE_0__.hostname();
    return super._prepareEvent(event, hint, scope);
  }

  /**
   * Method responsible for capturing/ending a request session by calling `incrementSessionStatusCount` to increment
   * appropriate session aggregates bucket
   */
   _captureRequestSession() {
    if (!this._sessionFlusher) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_6__.logger.warn('Discarded request mode session because autoSessionTracking option was disabled');
    } else {
      this._sessionFlusher.incrementSessionStatusCount();
    }
  }
}


//# sourceMappingURL=client.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/eventbuilder.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "eventFromMessage": () => (/* binding */ eventFromMessage),
/* harmony export */   "eventFromUnknownInput": () => (/* binding */ eventFromUnknownInput),
/* harmony export */   "exceptionFromError": () => (/* binding */ exceptionFromError),
/* harmony export */   "parseStackFrames": () => (/* binding */ parseStackFrames)
/* harmony export */ });
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/hub/esm/hub.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/is.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/object.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/utils/esm/normalize.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/utils/esm/misc.js");



/**
 * Extracts stack frames from the error.stack string
 */
function parseStackFrames(stackParser, error) {
  return stackParser(error.stack || '', 1);
}

/**
 * Extracts stack frames from the error and builds a Sentry Exception
 */
function exceptionFromError(stackParser, error) {
  var exception = {
    type: error.name || error.constructor.name,
    value: error.message,
  };

  var frames = parseStackFrames(stackParser, error);
  if (frames.length) {
    exception.stacktrace = { frames };
  }

  return exception;
}

/**
 * Builds and Event from a Exception
 * @hidden
 */
function eventFromUnknownInput(stackParser, exception, hint) {
    let ex = exception;
  var providedMechanism =
    hint && hint.data && (hint.data ).mechanism;
  var mechanism = providedMechanism || {
    handled: true,
    type: 'generic',
  };

  if (!(0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.isError)(exception)) {
    if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(exception)) {
      // This will allow us to group events based on top-level keys
      // which is much better than creating new group when any key/value change
      var message = `Non-Error exception captured with keys: ${(0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.extractExceptionKeysForMessage)(exception)}`;

      (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_2__.getCurrentHub)().configureScope(scope => {
        scope.setExtra('__serialized__', (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.normalizeToSize)(exception));
      });

      ex = (hint && hint.syntheticException) || new Error(message);
      (ex ).message = message;
    } else {
      // This handles when someone does: `throw "something awesome";`
      // We use synthesized Error here so we can extract a (rough) stack trace.
      ex = (hint && hint.syntheticException) || new Error(exception );
      (ex ).message = exception ;
    }
    mechanism.synthetic = true;
  }

  var event = {
    exception: {
      values: [exceptionFromError(stackParser, ex )],
    },
  };

  (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.addExceptionTypeValue)(event, undefined, undefined);
  (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.addExceptionMechanism)(event, mechanism);

  return {
    ...event,
    event_id: hint && hint.event_id,
  };
}

/**
 * Builds and Event from a Message
 * @hidden
 */
function eventFromMessage(
  stackParser,
  message,
    level = 'info',
  hint,
  attachStacktrace,
) {
  var event = {
    event_id: hint && hint.event_id,
    level,
    message,
  };

  if (attachStacktrace && hint && hint.syntheticException) {
    var frames = parseStackFrames(stackParser, hint.syntheticException);
    if (frames.length) {
      event.exception = {
        values: [
          {
            value: message,
            stacktrace: { frames },
          },
        ],
      };
    }
  }

  return event;
}


//# sourceMappingURL=eventbuilder.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/handlers.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "errorHandler": () => (/* binding */ errorHandler),
/* harmony export */   "extractRequestData": () => (/* reexport safe */ _requestDataDeprecated_js__WEBPACK_IMPORTED_MODULE_1__.extractRequestData),
/* harmony export */   "parseRequest": () => (/* reexport safe */ _requestDataDeprecated_js__WEBPACK_IMPORTED_MODULE_1__.parseRequest),
/* harmony export */   "requestHandler": () => (/* binding */ requestHandler),
/* harmony export */   "tracingHandler": () => (/* binding */ tracingHandler)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/hub/esm/hub.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./node_modules/@sentry/hub/esm/exports.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@sentry/utils/esm/is.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/@sentry/utils/esm/tracing.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/@sentry/utils/esm/baggage.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./node_modules/@sentry/utils/esm/requestdata.js");
/* harmony import */ var domain__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("domain");
/* harmony import */ var domain__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(domain__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _requestDataDeprecated_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/node/esm/requestDataDeprecated.js");
/* harmony import */ var _sdk_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/node/esm/sdk.js");








/**
 * Express-compatible tracing handler.
 * @see Exposed as `Handlers.tracingHandler`
 */
function tracingHandler()

 {
  return function sentryTracingMiddleware(
    req,
    res,
    next,
  ) {
    var hub = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_3__.getCurrentHub)();
    var options = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._optionalChain)([hub, 'access', _ => _.getClient, 'call', _2 => _2(), 'optionalAccess', _3 => _3.getOptions, 'call', _4 => _4()]);

    if (!options || (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._optionalChain)([req, 'access', _5 => _5.method, 'optionalAccess', _6 => _6.toUpperCase, 'call', _7 => _7()]) === 'OPTIONS' || (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._optionalChain)([req, 'access', _8 => _8.method, 'optionalAccess', _9 => _9.toUpperCase, 'call', _10 => _10()]) === 'HEAD') {
      return next();
    }

    // TODO: This is the `hasTracingEnabled` check, but we're doing it manually since `@sentry/tracing` isn't a
    // dependency of `@sentry/node`. Long term, that function should probably move to `@sentry/hub.
    if (!('tracesSampleRate' in options) && !('tracesSampler' in options)) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
        _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.warn(
          'Sentry `tracingHandler` is being used, but tracing is disabled. Please enable tracing by setting ' +
            'either `tracesSampleRate` or `tracesSampler` in your `Sentry.init()` options.',
        );
      return next();
    }

    // If there is a trace header set, we extract the data from it (parentSpanId, traceId, and sampling decision)
    var traceparentData =
      req.headers && (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.isString)(req.headers['sentry-trace']) && (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_7__.extractTraceparentData)(req.headers['sentry-trace']);
    var rawBaggageString = req.headers && (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.isString)(req.headers.baggage) && req.headers.baggage;

    var baggage = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_8__.parseBaggageSetMutability)(rawBaggageString, traceparentData);

    const [name, source] = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_9__.extractPathForTransaction)(req, { path: true, method: true });
    var transaction = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_10__.startTransaction)(
      {
        name,
        op: 'http.server',
        ...traceparentData,
        metadata: { baggage, source },
      },
      // extra context passed to the tracesSampler
      { request: (0,_sdk_js__WEBPACK_IMPORTED_MODULE_2__.extractRequestData)(req) },
    );

    // We put the transaction on the scope so users can attach children to it
    hub.configureScope(scope => {
      scope.setSpan(transaction);
    });

    // We also set __sentry_transaction on the response so people can grab the transaction there to add
    // spans to it later.
        (res ).__sentry_transaction = transaction;

    res.once('finish', () => {
      // Push `transaction.finish` to the next event loop so open spans have a chance to finish before the transaction
      // closes
      setImmediate(() => {
        (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_9__.addRequestDataToTransaction)(transaction, req);
        transaction.setHttpStatus(res.statusCode);
        transaction.finish();
      });
    });

    next();
  };
}

/**
 * Express compatible request handler.
 * @see Exposed as `Handlers.requestHandler`
 */
function requestHandler(
  options,
) {
  var currentHub = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_3__.getCurrentHub)();
  var client = currentHub.getClient();
  // Initialise an instance of SessionFlusher on the client when `autoSessionTracking` is enabled and the
  // `requestHandler` middleware is used indicating that we are running in SessionAggregates mode
  if (client && (0,_sdk_js__WEBPACK_IMPORTED_MODULE_2__.isAutoSessionTrackingEnabled)(client)) {
    client.initSessionFlusher();

    // If Scope contains a Single mode Session, it is removed in favor of using Session Aggregates mode
    var scope = currentHub.getScope();
    if (scope && scope.getSession()) {
      scope.setSession();
    }
  }

  return function sentryRequestMiddleware(
    req,
    res,
    next,
  ) {
    // TODO (v8 / XXX) Remove this shim and just use `addRequestDataToEvent`
    let backwardsCompatibleEventProcessor;
    if (options && 'include' in options) {
      backwardsCompatibleEventProcessor = (event) => (0,_sdk_js__WEBPACK_IMPORTED_MODULE_2__.addRequestDataToEvent)(event, req, options);
    } else {
            backwardsCompatibleEventProcessor = (event) => (0,_requestDataDeprecated_js__WEBPACK_IMPORTED_MODULE_1__.parseRequest)(event, req, options );
    }

    if (options && options.flushTimeout && options.flushTimeout > 0) {
            var _end = res.end;
      res.end = function (chunk, encoding, cb) {
        void (0,_sdk_js__WEBPACK_IMPORTED_MODULE_2__.flush)(options.flushTimeout)
          .then(() => {
            _end.call(this, chunk, encoding, cb);
          })
          .then(null, e => {
            (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.error(e);
            _end.call(this, chunk, encoding, cb);
          });
      };
    }
    var local = domain__WEBPACK_IMPORTED_MODULE_0__.create();
    local.add(req);
    local.add(res);

    local.run(() => {
      var currentHub = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_3__.getCurrentHub)();

      currentHub.configureScope(scope => {
        scope.addEventProcessor(backwardsCompatibleEventProcessor);
        var client = currentHub.getClient();
        if ((0,_sdk_js__WEBPACK_IMPORTED_MODULE_2__.isAutoSessionTrackingEnabled)(client)) {
          var scope = currentHub.getScope();
          if (scope) {
            // Set `status` of `RequestSession` to Ok, at the beginning of the request
            scope.setRequestSession({ status: 'ok' });
          }
        }
      });

      res.once('finish', () => {
        var client = currentHub.getClient();
        if ((0,_sdk_js__WEBPACK_IMPORTED_MODULE_2__.isAutoSessionTrackingEnabled)(client)) {
          setImmediate(() => {
                        if (client && (client )._captureRequestSession) {
              // Calling _captureRequestSession to capture request session at the end of the request by incrementing
              // the correct SessionAggregates bucket i.e. crashed, errored or exited
                            (client )._captureRequestSession();
            }
          });
        }
      });
      next();
    });
  };
}

/** JSDoc */

/** JSDoc */
function getStatusCodeFromResponse(error) {
  var statusCode = error.status || error.statusCode || error.status_code || (error.output && error.output.statusCode);
  return statusCode ? parseInt(statusCode , 10) : 500;
}

/** Returns true if response code is internal server error */
function defaultShouldHandleError(error) {
  var status = getStatusCodeFromResponse(error);
  return status >= 500;
}

/**
 * Express compatible error handler.
 * @see Exposed as `Handlers.errorHandler`
 */
function errorHandler(options

)

 {
  return function sentryErrorMiddleware(
    error,
    _req,
    res,
    next,
  ) {
        var shouldHandleError = (options && options.shouldHandleError) || defaultShouldHandleError;

    if (shouldHandleError(error)) {
      (0,_sentry_core__WEBPACK_IMPORTED_MODULE_10__.withScope)(_scope => {
        // For some reason we need to set the transaction on the scope again
                var transaction = (res ).__sentry_transaction ;
        if (transaction && _scope.getSpan() === undefined) {
          _scope.setSpan(transaction);
        }

        var client = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_3__.getCurrentHub)().getClient();
        if (client && (0,_sdk_js__WEBPACK_IMPORTED_MODULE_2__.isAutoSessionTrackingEnabled)(client)) {
          // Check if the `SessionFlusher` is instantiated on the client to go into this branch that marks the
          // `requestSession.status` as `Crashed`, and this check is necessary because the `SessionFlusher` is only
          // instantiated when the the`requestHandler` middleware is initialised, which indicates that we should be
          // running in SessionAggregates mode
                    var isSessionAggregatesMode = (client )._sessionFlusher !== undefined;
          if (isSessionAggregatesMode) {
            var requestSession = _scope.getRequestSession();
            // If an error bubbles to the `errorHandler`, then this is an unhandled error, and should be reported as a
            // Crashed session. The `_requestSession.status` is checked to ensure that this error is happening within
            // the bounds of a request, and if so the status is updated
            if (requestSession && requestSession.status !== undefined) {
              requestSession.status = 'crashed';
            }
          }
        }

        var eventId = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_10__.captureException)(error);
                (res ).sentry = eventId;
        next(error);
      });

      return;
    }

    next(error);
  };
}

// TODO (v8 / #5257): Remove this
;


//# sourceMappingURL=handlers.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/index.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Handlers": () => (/* reexport module object */ _handlers_js__WEBPACK_IMPORTED_MODULE_10__),
/* harmony export */   "Hub": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_0__.Hub),
/* harmony export */   "Integrations": () => (/* binding */ INTEGRATIONS),
/* harmony export */   "NodeClient": () => (/* reexport safe */ _client_js__WEBPACK_IMPORTED_MODULE_5__.NodeClient),
/* harmony export */   "SDK_VERSION": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_1__.SDK_VERSION),
/* harmony export */   "Scope": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_2__.Scope),
/* harmony export */   "addBreadcrumb": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_3__.addBreadcrumb),
/* harmony export */   "addGlobalEventProcessor": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_2__.addGlobalEventProcessor),
/* harmony export */   "addRequestDataToEvent": () => (/* reexport safe */ _sdk_js__WEBPACK_IMPORTED_MODULE_7__.addRequestDataToEvent),
/* harmony export */   "captureEvent": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_3__.captureEvent),
/* harmony export */   "captureException": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_3__.captureException),
/* harmony export */   "captureMessage": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_3__.captureMessage),
/* harmony export */   "close": () => (/* reexport safe */ _sdk_js__WEBPACK_IMPORTED_MODULE_7__.close),
/* harmony export */   "configureScope": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_3__.configureScope),
/* harmony export */   "createTransport": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_4__.createTransport),
/* harmony export */   "deepReadDirSync": () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_8__.deepReadDirSync),
/* harmony export */   "defaultIntegrations": () => (/* reexport safe */ _sdk_js__WEBPACK_IMPORTED_MODULE_7__.defaultIntegrations),
/* harmony export */   "defaultStackParser": () => (/* reexport safe */ _sdk_js__WEBPACK_IMPORTED_MODULE_7__.defaultStackParser),
/* harmony export */   "extractRequestData": () => (/* reexport safe */ _sdk_js__WEBPACK_IMPORTED_MODULE_7__.extractRequestData),
/* harmony export */   "flush": () => (/* reexport safe */ _sdk_js__WEBPACK_IMPORTED_MODULE_7__.flush),
/* harmony export */   "getCurrentHub": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub),
/* harmony export */   "getHubFromCarrier": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_0__.getHubFromCarrier),
/* harmony export */   "getSentryRelease": () => (/* reexport safe */ _sdk_js__WEBPACK_IMPORTED_MODULE_7__.getSentryRelease),
/* harmony export */   "init": () => (/* reexport safe */ _sdk_js__WEBPACK_IMPORTED_MODULE_7__.init),
/* harmony export */   "lastEventId": () => (/* reexport safe */ _sdk_js__WEBPACK_IMPORTED_MODULE_7__.lastEventId),
/* harmony export */   "makeMain": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_0__.makeMain),
/* harmony export */   "makeNodeTransport": () => (/* reexport safe */ _transports_http_js__WEBPACK_IMPORTED_MODULE_12__.makeNodeTransport),
/* harmony export */   "setContext": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_3__.setContext),
/* harmony export */   "setExtra": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_3__.setExtra),
/* harmony export */   "setExtras": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_3__.setExtras),
/* harmony export */   "setTag": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_3__.setTag),
/* harmony export */   "setTags": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_3__.setTags),
/* harmony export */   "setUser": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_3__.setUser),
/* harmony export */   "startTransaction": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_3__.startTransaction),
/* harmony export */   "withScope": () => (/* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_3__.withScope)
/* harmony export */ });
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./node_modules/@sentry/core/esm/integrations/index.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/hub/esm/hub.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/core/esm/version.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/hub/esm/scope.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/hub/esm/exports.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/core/esm/transports/base.js");
/* harmony import */ var _client_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/node/esm/client.js");
/* harmony import */ var _transports_index_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@sentry/node/esm/transports/index.js");
/* harmony import */ var _sdk_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/@sentry/node/esm/sdk.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/@sentry/node/esm/utils.js");
/* harmony import */ var domain__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("domain");
/* harmony import */ var domain__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(domain__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _handlers_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./node_modules/@sentry/node/esm/handlers.js");
/* harmony import */ var _integrations_index_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/index.js");
/* harmony import */ var _transports_http_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./node_modules/@sentry/node/esm/transports/http.js");













;
;

;

var INTEGRATIONS = {
  ..._sentry_core__WEBPACK_IMPORTED_MODULE_13__,
  ..._integrations_index_js__WEBPACK_IMPORTED_MODULE_11__,
};

// We need to patch domain on the global __SENTRY__ object to make it work for node in cross-platform packages like
// @sentry/hub. If we don't do this, browser bundlers will have troubles resolving `require('domain')`.
var carrier = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_0__.getMainCarrier)();
if (carrier.__SENTRY__) {
  carrier.__SENTRY__.extensions = carrier.__SENTRY__.extensions || {};
  carrier.__SENTRY__.extensions.domain = carrier.__SENTRY__.extensions.domain || domain__WEBPACK_IMPORTED_MODULE_9__;
}


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/integrations/console.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Console": () => (/* binding */ Console)
/* harmony export */ });
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/hub/esm/hub.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/object.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/utils/esm/severity.js");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("util");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_0__);




/** Console module integration */
class Console  {constructor() { Console.prototype.__init.call(this); }
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'Console';}

  /**
   * @inheritDoc
   */
   __init() {this.name = Console.id;}

  /**
   * @inheritDoc
   */
   setupOnce() {
    for (var level of ['debug', 'info', 'warn', 'error', 'log']) {
      (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.fill)(console, level, createConsoleWrapper(level));
    }
  }
} Console.__initStatic();

/**
 * Wrapper function that'll be used for every console level
 */
function createConsoleWrapper(level) {
  return function consoleWrapper(originalConsoleMethod) {
    var sentryLevel = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.severityLevelFromString)(level);

        return function () {
      if ((0,_sentry_core__WEBPACK_IMPORTED_MODULE_3__.getCurrentHub)().getIntegration(Console)) {
        (0,_sentry_core__WEBPACK_IMPORTED_MODULE_3__.getCurrentHub)().addBreadcrumb(
          {
            category: 'console',
            level: sentryLevel,
            message: util__WEBPACK_IMPORTED_MODULE_0__.format.apply(undefined, arguments),
          },
          {
            input: [...arguments],
            level,
          },
        );
      }

      originalConsoleMethod.apply(this, arguments);
    };
      };
}


//# sourceMappingURL=console.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/integrations/context.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Context": () => (/* binding */ Context),
/* harmony export */   "readDirAsync": () => (/* binding */ readDirAsync),
/* harmony export */   "readFileAsync": () => (/* binding */ readFileAsync)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("child_process");
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(child_process__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("os");
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("util");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_4__);







// TODO: Required until we drop support for Node v8
var readFileAsync = (0,util__WEBPACK_IMPORTED_MODULE_4__.promisify)(fs__WEBPACK_IMPORTED_MODULE_1__.readFile);
var readDirAsync = (0,util__WEBPACK_IMPORTED_MODULE_4__.promisify)(fs__WEBPACK_IMPORTED_MODULE_1__.readdir);

/** Add node modules / packages to the event */
class Context  {
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'Context';}

  /**
   * @inheritDoc
   */
   __init() {this.name = Context.id;}

  /**
   * Caches context so it's only evaluated once
   */
  

   constructor(  _options = { app: true, os: true, device: true, culture: true }) {;this._options = _options;Context.prototype.__init.call(this);
    //
  }

  /**
   * @inheritDoc
   */
   setupOnce(addGlobalEventProcessor) {
    addGlobalEventProcessor(event => this.addContext(event));
  }

  /** Processes an event and adds context */
   async addContext(event) {
    if (this._cachedContext === undefined) {
      this._cachedContext = this._getContexts();
    }

    var updatedContext = this._updateContext(await this._cachedContext);

    event.contexts = {
      ...event.contexts,
      app: { ...updatedContext.app, ...(0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__._optionalChain)([event, 'access', _ => _.contexts, 'optionalAccess', _2 => _2.app]) },
      os: { ...updatedContext.os, ...(0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__._optionalChain)([event, 'access', _3 => _3.contexts, 'optionalAccess', _4 => _4.os]) },
      device: { ...updatedContext.device, ...(0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__._optionalChain)([event, 'access', _5 => _5.contexts, 'optionalAccess', _6 => _6.device]) },
      culture: { ...updatedContext.culture, ...(0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__._optionalChain)([event, 'access', _7 => _7.contexts, 'optionalAccess', _8 => _8.culture]) },
    };

    return event;
  }

  /**
   * Updates the context with dynamic values that can change
   */
   _updateContext(contexts) {
    // Only update properties if they exist
    if ((0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__._optionalChain)([contexts, 'optionalAccess', _9 => _9.app, 'optionalAccess', _10 => _10.app_memory])) {
      contexts.app.app_memory = process.memoryUsage().rss;
    }

    if ((0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__._optionalChain)([contexts, 'optionalAccess', _11 => _11.device, 'optionalAccess', _12 => _12.free_memory])) {
      contexts.device.free_memory = os__WEBPACK_IMPORTED_MODULE_2__.freemem();
    }

    return contexts;
  }

  /**
   * Gets the contexts for the current environment
   */
   async _getContexts() {
    var contexts = {};

    if (this._options.os) {
      contexts.os = await getOsContext();
    }

    if (this._options.app) {
      contexts.app = getAppContext();
    }

    if (this._options.device) {
      contexts.device = getDeviceContext(this._options.device);
    }

    if (this._options.culture) {
      var culture = getCultureContext();

      if (culture) {
        contexts.culture = culture;
      }
    }

    return contexts;
  }
}Context.__initStatic();

/**
 * Returns the operating system context.
 *
 * Based on the current platform, this uses a different strategy to provide the
 * most accurate OS information. Since this might involve spawning subprocesses
 * or accessing the file system, this should only be executed lazily and cached.
 *
 *  - On macOS (Darwin), this will execute the `sw_vers` utility. The context
 *    has a `name`, `version`, `build` and `kernel_version` set.
 *  - On Linux, this will try to load a distribution release from `/etc` and set
 *    the `name`, `version` and `kernel_version` fields.
 *  - On all other platforms, only a `name` and `version` will be returned. Note
 *    that `version` might actually be the kernel version.
 */
async function getOsContext() {
  var platformId = os__WEBPACK_IMPORTED_MODULE_2__.platform();
  switch (platformId) {
    case 'darwin':
      return getDarwinInfo();
    case 'linux':
      return getLinuxInfo();
    default:
      return {
        name: PLATFORM_NAMES[platformId] || platformId,
        version: os__WEBPACK_IMPORTED_MODULE_2__.release(),
      };
  }
}

function getCultureContext() {
  try {
        if (typeof (process.versions ).icu !== 'string') {
      // Node was built without ICU support
      return;
    }

    // Check that node was built with full Intl support. Its possible it was built without support for non-English
    // locales which will make resolvedOptions inaccurate
    //
    // https://nodejs.org/api/intl.html#detecting-internationalization-support
    var january = new Date(9e8);
    var spanish = new Intl.DateTimeFormat('es', { month: 'long' });
    if (spanish.format(january) === 'enero') {
      var options = Intl.DateTimeFormat().resolvedOptions();

      return {
        locale: options.locale,
        timezone: options.timeZone,
      };
    }
  } catch (err) {
    //
  }

  return;
}

function getAppContext() {
  var app_memory = process.memoryUsage().rss;
  var app_start_time = new Date(Date.now() - process.uptime() * 1000).toISOString();

  return { app_start_time, app_memory };
}

function getDeviceContext(deviceOpt) {
  var device = {};

  device.boot_time = new Date(Date.now() - os__WEBPACK_IMPORTED_MODULE_2__.uptime() * 1000).toISOString();
  device.arch = os__WEBPACK_IMPORTED_MODULE_2__.arch();

  if (deviceOpt === true || deviceOpt.memory) {
    device.memory_size = os__WEBPACK_IMPORTED_MODULE_2__.totalmem();
    device.free_memory = os__WEBPACK_IMPORTED_MODULE_2__.freemem();
  }

  if (deviceOpt === true || deviceOpt.cpu) {
    var cpuInfo = os__WEBPACK_IMPORTED_MODULE_2__.cpus();
    if (cpuInfo && cpuInfo.length) {
      var firstCpu = cpuInfo[0];

      device.processor_count = cpuInfo.length;
      device.cpu_description = firstCpu.model;
      device.processor_frequency = firstCpu.speed;
    }
  }

  return device;
}

/** Mapping of Node's platform names to actual OS names. */
var PLATFORM_NAMES = {
  aix: 'IBM AIX',
  freebsd: 'FreeBSD',
  openbsd: 'OpenBSD',
  sunos: 'SunOS',
  win32: 'Windows',
};

/** Linux version file to check for a distribution. */

/** Mapping of linux release files located in /etc to distributions. */
var LINUX_DISTROS = [
  { name: 'fedora-release', distros: ['Fedora'] },
  { name: 'redhat-release', distros: ['Red Hat Linux', 'Centos'] },
  { name: 'redhat_version', distros: ['Red Hat Linux'] },
  { name: 'SuSE-release', distros: ['SUSE Linux'] },
  { name: 'lsb-release', distros: ['Ubuntu Linux', 'Arch Linux'] },
  { name: 'debian_version', distros: ['Debian'] },
  { name: 'debian_release', distros: ['Debian'] },
  { name: 'arch-release', distros: ['Arch Linux'] },
  { name: 'gentoo-release', distros: ['Gentoo Linux'] },
  { name: 'novell-release', distros: ['SUSE Linux'] },
  { name: 'alpine-release', distros: ['Alpine Linux'] },
];

/** Functions to extract the OS version from Linux release files. */
var LINUX_VERSIONS

 = {
  alpine: content => content,
  arch: content => matchFirst(/distrib_release=(.*)/, content),
  centos: content => matchFirst(/release ([^ ]+)/, content),
  debian: content => content,
  fedora: content => matchFirst(/release (..)/, content),
  mint: content => matchFirst(/distrib_release=(.*)/, content),
  red: content => matchFirst(/release ([^ ]+)/, content),
  suse: content => matchFirst(/VERSION = (.*)\n/, content),
  ubuntu: content => matchFirst(/distrib_release=(.*)/, content),
};

/**
 * Executes a regular expression with one capture group.
 *
 * @param regex A regular expression to execute.
 * @param text Content to execute the RegEx on.
 * @returns The captured string if matched; otherwise undefined.
 */
function matchFirst(regex, text) {
  var match = regex.exec(text);
  return match ? match[1] : undefined;
}

/** Loads the macOS operating system context. */
async function getDarwinInfo() {
  // Default values that will be used in case no operating system information
  // can be loaded. The default version is computed via heuristics from the
  // kernel version, but the build ID is missing.
  var darwinInfo = {
    kernel_version: os__WEBPACK_IMPORTED_MODULE_2__.release(),
    name: 'Mac OS X',
    version: `10.${Number(os__WEBPACK_IMPORTED_MODULE_2__.release().split('.')[0]) - 4}`,
  };

  try {
    // We try to load the actual macOS version by executing the `sw_vers` tool.
    // This tool should be available on every standard macOS installation. In
    // case this fails, we stick with the values computed above.

    var output = await new Promise((resolve, reject) => {
      (0,child_process__WEBPACK_IMPORTED_MODULE_0__.execFile)('/usr/bin/sw_vers', (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout);
      });
    });

    darwinInfo.name = matchFirst(/^ProductName:\s+(.*)$/m, output);
    darwinInfo.version = matchFirst(/^ProductVersion:\s+(.*)$/m, output);
    darwinInfo.build = matchFirst(/^BuildVersion:\s+(.*)$/m, output);
  } catch (e) {
    // ignore
  }

  return darwinInfo;
}

/** Returns a distribution identifier to look up version callbacks. */
function getLinuxDistroId(name) {
  return name.split(' ')[0].toLowerCase();
}

/** Loads the Linux operating system context. */
async function getLinuxInfo() {
  // By default, we cannot assume anything about the distribution or Linux
  // version. `os.release()` returns the kernel version and we assume a generic
  // "Linux" name, which will be replaced down below.
  var linuxInfo = {
    kernel_version: os__WEBPACK_IMPORTED_MODULE_2__.release(),
    name: 'Linux',
  };

  try {
    // We start guessing the distribution by listing files in the /etc
    // directory. This is were most Linux distributions (except Knoppix) store
    // release files with certain distribution-dependent meta data. We search
    // for exactly one known file defined in `LINUX_DISTROS` and exit if none
    // are found. In case there are more than one file, we just stick with the
    // first one.
    var etcFiles = await readDirAsync('/etc');
    var distroFile = LINUX_DISTROS.find(file => etcFiles.includes(file.name));
    if (!distroFile) {
      return linuxInfo;
    }

    // Once that file is known, load its contents. To make searching in those
    // files easier, we lowercase the file contents. Since these files are
    // usually quite small, this should not allocate too much memory and we only
    // hold on to it for a very short amount of time.
    var distroPath = (0,path__WEBPACK_IMPORTED_MODULE_3__.join)('/etc', distroFile.name);
    var contents = ((await readFileAsync(distroPath, { encoding: 'utf-8' })) ).toLowerCase();

    // Some Linux distributions store their release information in the same file
    // (e.g. RHEL and Centos). In those cases, we scan the file for an
    // identifier, that basically consists of the first word of the linux
    // distribution name (e.g. "red" for Red Hat). In case there is no match, we
    // just assume the first distribution in our list.
    const { distros } = distroFile;
    linuxInfo.name = distros.find(d => contents.indexOf(getLinuxDistroId(d)) >= 0) || distros[0];

    // Based on the found distribution, we can now compute the actual version
    // number. This is different for every distribution, so several strategies
    // are computed in `LINUX_VERSIONS`.
    var id = getLinuxDistroId(linuxInfo.name);
    linuxInfo.version = LINUX_VERSIONS[id](contents);
  } catch (e) {
    // ignore
  }

  return linuxInfo;
}


//# sourceMappingURL=context.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/integrations/contextlines.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ContextLines": () => (/* binding */ ContextLines),
/* harmony export */   "resetFileContentCache": () => (/* binding */ resetFileContentCache)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/utils/esm/misc.js");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lru_map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/lru_map/lru.js");
/* harmony import */ var lru_map__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lru_map__WEBPACK_IMPORTED_MODULE_1__);





var FILE_CONTENT_CACHE = new lru_map__WEBPACK_IMPORTED_MODULE_1__.LRUMap(100);
var DEFAULT_LINES_OF_CONTEXT = 7;

// TODO: Replace with promisify when minimum supported node >= v8
function readTextFileAsync(path) {
  return new Promise((resolve, reject) => {
    (0,fs__WEBPACK_IMPORTED_MODULE_0__.readFile)(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

/**
 * Resets the file cache. Exists for testing purposes.
 * @hidden
 */
function resetFileContentCache() {
  FILE_CONTENT_CACHE.clear();
}

/** Add node modules / packages to the event */
class ContextLines  {
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'ContextLines';}

  /**
   * @inheritDoc
   */
   __init() {this.name = ContextLines.id;}

   constructor(  _options = {}) {;this._options = _options;ContextLines.prototype.__init.call(this);}

  /** Get's the number of context lines to add */
   get _contextLines() {
    return this._options.frameContextLines !== undefined ? this._options.frameContextLines : DEFAULT_LINES_OF_CONTEXT;
  }

  /**
   * @inheritDoc
   */
   setupOnce(addGlobalEventProcessor) {
    addGlobalEventProcessor(event => this.addSourceContext(event));
  }

  /** Processes an event and adds context lines */
   async addSourceContext(event) {
    if (this._contextLines > 0 && (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([event, 'access', _2 => _2.exception, 'optionalAccess', _3 => _3.values])) {
      for (var exception of event.exception.values) {
        if ((0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([exception, 'access', _4 => _4.stacktrace, 'optionalAccess', _5 => _5.frames])) {
          await this.addSourceContextToFrames(exception.stacktrace.frames);
        }
      }
    }

    return event;
  }

  /** Adds context lines to frames */
   async addSourceContextToFrames(frames) {
    var contextLines = this._contextLines;

    for (var frame of frames) {
      // Only add context if we have a filename and it hasn't already been added
      if (frame.filename && frame.context_line === undefined) {
        var sourceFile = await _readSourceFile(frame.filename);

        if (sourceFile) {
          try {
            var lines = sourceFile.split('\n');
            (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.addContextToFrame)(lines, frame, contextLines);
          } catch (e) {
            // anomaly, being defensive in case
            // unlikely to ever happen in practice but can definitely happen in theory
          }
        }
      }
    }
  }
}ContextLines.__initStatic();

/**
 * Reads file contents and caches them in a global LRU cache.
 *
 * @param filename filepath to read content from.
 */
async function _readSourceFile(filename) {
  var cachedFile = FILE_CONTENT_CACHE.get(filename);
  // We have a cache hit
  if (cachedFile !== undefined) {
    return cachedFile;
  }

  let content = null;
  try {
    content = await readTextFileAsync(filename);
  } catch (_) {
    //
  }

  FILE_CONTENT_CACHE.set(filename, content);
  return content;
}


//# sourceMappingURL=contextlines.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/integrations/http.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Http": () => (/* binding */ Http)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/hub/esm/hub.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/misc.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/utils/esm/object.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/utils/esm/string.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/@sentry/utils/esm/baggage.js");
/* harmony import */ var _utils_http_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/utils/http.js");





var NODE_VERSION = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.parseSemver)(process.versions.node);

/**
 * The http module integration instruments Node's internal http module. It creates breadcrumbs, transactions for outgoing
 * http requests and attaches trace data when tracing is enabled via its `tracing` option.
 */
class Http  {
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'Http';}

  /**
   * @inheritDoc
   */
   __init() {this.name = Http.id;}

  /**
   * @inheritDoc
   */
  

  /**
   * @inheritDoc
   */
  

  /**
   * @inheritDoc
   */
   constructor(options = {}) {;Http.prototype.__init.call(this);
    this._breadcrumbs = typeof options.breadcrumbs === 'undefined' ? true : options.breadcrumbs;
    this._tracing = typeof options.tracing === 'undefined' ? false : options.tracing;
  }

  /**
   * @inheritDoc
   */
   setupOnce(
    _addGlobalEventProcessor,
    setupOnceGetCurrentHub,
  ) {
    // No need to instrument if we don't want to track anything
    if (!this._breadcrumbs && !this._tracing) {
      return;
    }

    var clientOptions = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([setupOnceGetCurrentHub, 'call', _ => _(), 'access', _2 => _2.getClient, 'call', _3 => _3(), 'optionalAccess', _4 => _4.getOptions, 'call', _5 => _5()]) ;

    var wrappedHandlerMaker = _createWrappedRequestMethodFactory(
      this._breadcrumbs,
      this._tracing,
      (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([clientOptions, 'optionalAccess', _6 => _6.tracePropagationTargets]),
    );

        var httpModule = __webpack_require__("http");
    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.fill)(httpModule, 'get', wrappedHandlerMaker);
    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.fill)(httpModule, 'request', wrappedHandlerMaker);

    // NOTE: Prior to Node 9, `https` used internals of `http` module, thus we don't patch it.
    // If we do, we'd get double breadcrumbs and double spans for `https` calls.
    // It has been changed in Node 9, so for all versions equal and above, we patch `https` separately.
    if (NODE_VERSION.major && NODE_VERSION.major > 8) {
            var httpsModule = __webpack_require__("https");
      (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.fill)(httpsModule, 'get', wrappedHandlerMaker);
      (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.fill)(httpsModule, 'request', wrappedHandlerMaker);
    }
  }
}Http.__initStatic();

// for ease of reading below

/**
 * Function which creates a function which creates wrapped versions of internal `request` and `get` calls within `http`
 * and `https` modules. (NB: Not a typo - this is a creator^2!)
 *
 * @param breadcrumbsEnabled Whether or not to record outgoing requests as breadcrumbs
 * @param tracingEnabled Whether or not to record outgoing requests as tracing spans
 *
 * @returns A function which accepts the exiting handler and returns a wrapped handler
 */
function _createWrappedRequestMethodFactory(
  breadcrumbsEnabled,
  tracingEnabled,
  tracePropagationTargets,
) {
  // We're caching results so we dont have to recompute regexp everytime we create a request.
  var urlMap = {};
  var shouldAttachTraceData = (url) => {
    if (tracePropagationTargets === undefined) {
      return true;
    }

    if (urlMap[url]) {
      return urlMap[url];
    }

    urlMap[url] = tracePropagationTargets.some(tracePropagationTarget =>
      (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.isMatchingPattern)(url, tracePropagationTarget),
    );

    return urlMap[url];
  };

  return function wrappedRequestMethodFactory(originalRequestMethod) {
    return function wrappedMethod( ...args) {
            var httpModule = this;

      var requestArgs = (0,_utils_http_js__WEBPACK_IMPORTED_MODULE_0__.normalizeRequestArgs)(this, args);
      var requestOptions = requestArgs[0];
      var requestUrl = (0,_utils_http_js__WEBPACK_IMPORTED_MODULE_0__.extractUrl)(requestOptions);

      // we don't want to record requests to Sentry as either breadcrumbs or spans, so just use the original method
      if ((0,_utils_http_js__WEBPACK_IMPORTED_MODULE_0__.isSentryRequest)(requestUrl)) {
        return originalRequestMethod.apply(httpModule, requestArgs);
      }

      let span;
      let parentSpan;

      var scope = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_5__.getCurrentHub)().getScope();

      if (scope && tracingEnabled) {
        parentSpan = scope.getSpan();

        if (parentSpan) {
          span = parentSpan.startChild({
            description: `${requestOptions.method || 'GET'} ${requestUrl}`,
            op: 'http.client',
          });

          if (shouldAttachTraceData(requestUrl)) {
            var sentryTraceHeader = span.toTraceparent();
            (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
              _sentry_utils__WEBPACK_IMPORTED_MODULE_6__.logger.log(
                `[Tracing] Adding sentry-trace header ${sentryTraceHeader} to outgoing request to "${requestUrl}": `,
              );

            var baggage = parentSpan.transaction && parentSpan.transaction.getBaggage();
            var headerBaggageString = requestOptions.headers && requestOptions.headers.baggage;

            requestOptions.headers = {
              ...requestOptions.headers,
              'sentry-trace': sentryTraceHeader,
              baggage: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_7__.mergeAndSerializeBaggage)(baggage, headerBaggageString),
            };
          } else {
            (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
              _sentry_utils__WEBPACK_IMPORTED_MODULE_6__.logger.log(
                `[Tracing] Not adding sentry-trace header to outgoing request (${requestUrl}) due to mismatching tracePropagationTargets option.`,
              );
          }
        }
      }

            return originalRequestMethod
        .apply(httpModule, requestArgs)
        .once('response', function ( res) {
                    var req = this;
          if (breadcrumbsEnabled) {
            addRequestBreadcrumb('response', requestUrl, req, res);
          }
          if (tracingEnabled && span) {
            if (res.statusCode) {
              span.setHttpStatus(res.statusCode);
            }
            span.description = (0,_utils_http_js__WEBPACK_IMPORTED_MODULE_0__.cleanSpanDescription)(span.description, requestOptions, req);
            span.finish();
          }
        })
        .once('error', function () {
                    var req = this;

          if (breadcrumbsEnabled) {
            addRequestBreadcrumb('error', requestUrl, req);
          }
          if (tracingEnabled && span) {
            span.setHttpStatus(500);
            span.description = (0,_utils_http_js__WEBPACK_IMPORTED_MODULE_0__.cleanSpanDescription)(span.description, requestOptions, req);
            span.finish();
          }
        });
    };
  };
}

/**
 * Captures Breadcrumb based on provided request/response pair
 */
function addRequestBreadcrumb(event, url, req, res) {
  if (!(0,_sentry_core__WEBPACK_IMPORTED_MODULE_5__.getCurrentHub)().getIntegration(Http)) {
    return;
  }

  (0,_sentry_core__WEBPACK_IMPORTED_MODULE_5__.getCurrentHub)().addBreadcrumb(
    {
      category: 'http',
      data: {
        method: req.method,
        status_code: res && res.statusCode,
        url,
      },
      type: 'http',
    },
    {
      event,
      request: req,
      response: res,
    },
  );
}


//# sourceMappingURL=http.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/integrations/index.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Console": () => (/* reexport safe */ _console_js__WEBPACK_IMPORTED_MODULE_0__.Console),
/* harmony export */   "Context": () => (/* reexport safe */ _context_js__WEBPACK_IMPORTED_MODULE_7__.Context),
/* harmony export */   "ContextLines": () => (/* reexport safe */ _contextlines_js__WEBPACK_IMPORTED_MODULE_6__.ContextLines),
/* harmony export */   "Http": () => (/* reexport safe */ _http_js__WEBPACK_IMPORTED_MODULE_1__.Http),
/* harmony export */   "LinkedErrors": () => (/* reexport safe */ _linkederrors_js__WEBPACK_IMPORTED_MODULE_4__.LinkedErrors),
/* harmony export */   "Modules": () => (/* reexport safe */ _modules_js__WEBPACK_IMPORTED_MODULE_5__.Modules),
/* harmony export */   "OnUncaughtException": () => (/* reexport safe */ _onuncaughtexception_js__WEBPACK_IMPORTED_MODULE_2__.OnUncaughtException),
/* harmony export */   "OnUnhandledRejection": () => (/* reexport safe */ _onunhandledrejection_js__WEBPACK_IMPORTED_MODULE_3__.OnUnhandledRejection)
/* harmony export */ });
/* harmony import */ var _console_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/console.js");
/* harmony import */ var _http_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/http.js");
/* harmony import */ var _onuncaughtexception_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/onuncaughtexception.js");
/* harmony import */ var _onunhandledrejection_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/onunhandledrejection.js");
/* harmony import */ var _linkederrors_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/linkederrors.js");
/* harmony import */ var _modules_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/modules.js");
/* harmony import */ var _contextlines_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/contextlines.js");
/* harmony import */ var _context_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/context.js");








//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/integrations/linkederrors.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LinkedErrors": () => (/* binding */ LinkedErrors)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/hub/esm/scope.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/hub/esm/hub.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/utils/esm/is.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/utils/esm/syncpromise.js");
/* harmony import */ var _eventbuilder_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/node/esm/eventbuilder.js");
/* harmony import */ var _contextlines_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/contextlines.js");






var DEFAULT_KEY = 'cause';
var DEFAULT_LIMIT = 5;

/** Adds SDK info to an event. */
class LinkedErrors  {
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'LinkedErrors';}

  /**
   * @inheritDoc
   */
    __init() {this.name = LinkedErrors.id;}

  /**
   * @inheritDoc
   */
  

  /**
   * @inheritDoc
   */
  

  /**
   * @inheritDoc
   */
   constructor(options = {}) {;LinkedErrors.prototype.__init.call(this);
    this._key = options.key || DEFAULT_KEY;
    this._limit = options.limit || DEFAULT_LIMIT;
  }

  /**
   * @inheritDoc
   */
   setupOnce() {
    (0,_sentry_core__WEBPACK_IMPORTED_MODULE_2__.addGlobalEventProcessor)(async (event, hint) => {
      var hub = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_3__.getCurrentHub)();
      var self = hub.getIntegration(LinkedErrors);
      var client = hub.getClient();
      if (client && self && self._handler && typeof self._handler === 'function') {
        await self._handler(client.getOptions().stackParser, event, hint);
      }
      return event;
    });
  }

  /**
   * @inheritDoc
   */
   _handler(stackParser, event, hint) {
    if (!event.exception || !event.exception.values || !(0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.isInstanceOf)(hint.originalException, Error)) {
      return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.resolvedSyncPromise)(event);
    }

    return new _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.SyncPromise(resolve => {
      void this._walkErrorTree(stackParser, hint.originalException , this._key)
        .then((linkedErrors) => {
          if (event && event.exception && event.exception.values) {
            event.exception.values = [...linkedErrors, ...event.exception.values];
          }
          resolve(event);
        })
        .then(null, () => {
          resolve(event);
        });
    });
  }

  /**
   * @inheritDoc
   */
   async _walkErrorTree(
    stackParser,
    error,
    key,
    stack = [],
  ) {
    if (!(0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.isInstanceOf)(error[key], Error) || stack.length + 1 >= this._limit) {
      return Promise.resolve(stack);
    }

    var exception = (0,_eventbuilder_js__WEBPACK_IMPORTED_MODULE_0__.exceptionFromError)(stackParser, error[key]);

    // If the ContextLines integration is enabled, we add source code context to linked errors
    // because we can't guarantee the order that integrations are run.
    var contextLines = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_3__.getCurrentHub)().getIntegration(_contextlines_js__WEBPACK_IMPORTED_MODULE_1__.ContextLines);
    if (contextLines && (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_6__._optionalChain)([exception, 'access', _ => _.stacktrace, 'optionalAccess', _2 => _2.frames])) {
      await contextLines.addSourceContextToFrames(exception.stacktrace.frames);
    }

    return new Promise((resolve, reject) => {
      void this._walkErrorTree(stackParser, error[key], key, [exception, ...stack])
        .then(resolve)
        .then(null, () => {
          reject();
        });
    });
  }
}LinkedErrors.__initStatic();


//# sourceMappingURL=linkederrors.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/integrations/modules.js":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Modules": () => (/* binding */ Modules)
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);



let moduleCache;

/** Extract information about paths */
function getPaths() {
  try {
    return __webpack_require__.c ? Object.keys(__webpack_require__.c ) : [];
  } catch (e) {
    return [];
  }
}

/** Extract information about package.json modules */
function collectModules()

 {
  var mainPaths = (__webpack_require__.c[__webpack_require__.s] && __webpack_require__.c[__webpack_require__.s].paths) || [];
  var paths = getPaths();
  var infos

 = {};
  var seen

 = {};

  paths.forEach(path => {
    let dir = path;

    /** Traverse directories upward in the search of package.json file */
    var updir = () => {
      var orig = dir;
      dir = (0,path__WEBPACK_IMPORTED_MODULE_1__.dirname)(orig);

      if (!dir || orig === dir || seen[orig]) {
        return undefined;
      }
      if (mainPaths.indexOf(dir) < 0) {
        return updir();
      }

      var pkgfile = (0,path__WEBPACK_IMPORTED_MODULE_1__.join)(orig, 'package.json');
      seen[orig] = true;

      if (!(0,fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)(pkgfile)) {
        return updir();
      }

      try {
        var info = JSON.parse((0,fs__WEBPACK_IMPORTED_MODULE_0__.readFileSync)(pkgfile, 'utf8')) 

;
        infos[info.name] = info.version;
      } catch (_oO) {
        // no-empty
      }
    };

    updir();
  });

  return infos;
}

/** Add node modules / packages to the event */
class Modules  {constructor() { Modules.prototype.__init.call(this); }
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'Modules';}

  /**
   * @inheritDoc
   */
   __init() {this.name = Modules.id;}

  /**
   * @inheritDoc
   */
   setupOnce(addGlobalEventProcessor, getCurrentHub) {
    addGlobalEventProcessor(event => {
      if (!getCurrentHub().getIntegration(Modules)) {
        return event;
      }
      return {
        ...event,
        modules: this._getModules(),
      };
    });
  }

  /** Fetches the list of modules and the versions loaded by the entry file for your node.js app. */
   _getModules() {
    if (!moduleCache) {
      moduleCache = collectModules();
    }
    return moduleCache;
  }
} Modules.__initStatic();


//# sourceMappingURL=modules.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/integrations/onuncaughtexception.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OnUncaughtException": () => (/* binding */ OnUncaughtException)
/* harmony export */ });
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/hub/esm/hub.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _utils_errorhandling_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/utils/errorhandling.js");




/** Global Exception handler */
class OnUncaughtException  {
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'OnUncaughtException';}

  /**
   * @inheritDoc
   */
   __init() {this.name = OnUncaughtException.id;}

  /**
   * @inheritDoc
   */
    __init2() {this.handler = this._makeErrorHandler();}

  /**
   * @inheritDoc
   */
   constructor(
      _options

 = {},
  ) {;this._options = _options;OnUncaughtException.prototype.__init.call(this);OnUncaughtException.prototype.__init2.call(this);}
  /**
   * @inheritDoc
   */
   setupOnce() {
    global.process.on('uncaughtException', this.handler.bind(this));
  }

  /**
   * @hidden
   */
   _makeErrorHandler() {
    var timeout = 2000;
    let caughtFirstError = false;
    let caughtSecondError = false;
    let calledFatalError = false;
    let firstError;

    return (error) => {
      let onFatalError = _utils_errorhandling_js__WEBPACK_IMPORTED_MODULE_0__.logAndExitProcess;
      var client = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_1__.getCurrentHub)().getClient();

      if (this._options.onFatalError) {
                onFatalError = this._options.onFatalError;
      } else if (client && client.getOptions().onFatalError) {
                onFatalError = client.getOptions().onFatalError ;
      }

      if (!caughtFirstError) {
        var hub = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_1__.getCurrentHub)();

        // this is the first uncaught error and the ultimate reason for shutting down
        // we want to do absolutely everything possible to ensure it gets captured
        // also we want to make sure we don't go recursion crazy if more errors happen after this one
        firstError = error;
        caughtFirstError = true;

        if (hub.getIntegration(OnUncaughtException)) {
          hub.withScope((scope) => {
            scope.setLevel('fatal');
            hub.captureException(error, {
              originalException: error,
              data: { mechanism: { handled: false, type: 'onuncaughtexception' } },
            });
            if (!calledFatalError) {
              calledFatalError = true;
              onFatalError(error);
            }
          });
        } else {
          if (!calledFatalError) {
            calledFatalError = true;
            onFatalError(error);
          }
        }
      } else if (calledFatalError) {
        // we hit an error *after* calling onFatalError - pretty boned at this point, just shut it down
        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
          _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.warn('uncaught exception after calling fatal error shutdown callback - this is bad! forcing shutdown');
        (0,_utils_errorhandling_js__WEBPACK_IMPORTED_MODULE_0__.logAndExitProcess)(error);
      } else if (!caughtSecondError) {
        // two cases for how we can hit this branch:
        //   - capturing of first error blew up and we just caught the exception from that
        //     - quit trying to capture, proceed with shutdown
        //   - a second independent error happened while waiting for first error to capture
        //     - want to avoid causing premature shutdown before first error capture finishes
        // it's hard to immediately tell case 1 from case 2 without doing some fancy/questionable domain stuff
        // so let's instead just delay a bit before we proceed with our action here
        // in case 1, we just wait a bit unnecessarily but ultimately do the same thing
        // in case 2, the delay hopefully made us wait long enough for the capture to finish
        // two potential nonideal outcomes:
        //   nonideal case 1: capturing fails fast, we sit around for a few seconds unnecessarily before proceeding correctly by calling onFatalError
        //   nonideal case 2: case 2 happens, 1st error is captured but slowly, timeout completes before capture and we treat second error as the sendErr of (nonexistent) failure from trying to capture first error
        // note that after hitting this branch, we might catch more errors where (caughtSecondError && !calledFatalError)
        //   we ignore them - they don't matter to us, we're just waiting for the second error timeout to finish
        caughtSecondError = true;
        setTimeout(() => {
          if (!calledFatalError) {
            // it was probably case 1, let's treat err as the sendErr and call onFatalError
            calledFatalError = true;
            onFatalError(firstError, error);
          } else {
            // it was probably case 2, our first error finished capturing while we waited, cool, do nothing
          }
        }, timeout); // capturing could take at least sendTimeout to fail, plus an arbitrary second for how long it takes to collect surrounding source etc
      }
    };
  }
} OnUncaughtException.__initStatic();


//# sourceMappingURL=onuncaughtexception.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/integrations/onunhandledrejection.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OnUnhandledRejection": () => (/* binding */ OnUnhandledRejection)
/* harmony export */ });
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/hub/esm/hub.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _utils_errorhandling_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/utils/errorhandling.js");




/** Global Promise Rejection handler */
class OnUnhandledRejection  {
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'OnUnhandledRejection';}

  /**
   * @inheritDoc
   */
   __init() {this.name = OnUnhandledRejection.id;}

  /**
   * @inheritDoc
   */
   constructor(
      _options

 = { mode: 'warn' },
  ) {;this._options = _options;OnUnhandledRejection.prototype.__init.call(this);}

  /**
   * @inheritDoc
   */
   setupOnce() {
    global.process.on('unhandledRejection', this.sendUnhandledPromise.bind(this));
  }

  /**
   * Send an exception with reason
   * @param reason string
   * @param promise promise
   */
     sendUnhandledPromise(reason, promise) {
    var hub = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_1__.getCurrentHub)();
    if (hub.getIntegration(OnUnhandledRejection)) {
      hub.withScope((scope) => {
        scope.setExtra('unhandledPromiseRejection', true);
        hub.captureException(reason, {
          originalException: promise,
          data: { mechanism: { handled: false, type: 'onunhandledrejection' } },
        });
      });
    }
    this._handleRejection(reason);
  }

  /**
   * Handler for `mode` option
   */
     _handleRejection(reason) {
    // https://github.com/nodejs/node/blob/7cf6f9e964aa00772965391c23acda6d71972a9a/lib/internal/process/promises.js#L234-L240
    var rejectionWarning =
      'This error originated either by ' +
      'throwing inside of an async function without a catch block, ' +
      'or by rejecting a promise which was not handled with .catch().' +
      ' The promise rejected with the reason:';

        if (this._options.mode === 'warn') {
      (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.consoleSandbox)(() => {
        console.warn(rejectionWarning);
                console.error(reason && reason.stack ? reason.stack : reason);
      });
    } else if (this._options.mode === 'strict') {
      (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.consoleSandbox)(() => {
        console.warn(rejectionWarning);
      });
      (0,_utils_errorhandling_js__WEBPACK_IMPORTED_MODULE_0__.logAndExitProcess)(reason);
    }
      }
} OnUnhandledRejection.__initStatic();


//# sourceMappingURL=onunhandledrejection.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/integrations/utils/errorhandling.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "logAndExitProcess": () => (/* binding */ logAndExitProcess)
/* harmony export */ });
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/hub/esm/hub.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/logger.js");



var DEFAULT_SHUTDOWN_TIMEOUT = 2000;

/**
 * @hidden
 */
function logAndExitProcess(error) {
    console.error(error && error.stack ? error.stack : error);

  var client = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().getClient();

  if (client === undefined) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.warn('No NodeClient was defined, we are exiting the process now.');
    global.process.exit(1);
  }

  var options = client.getOptions();
  var timeout =
    (options && options.shutdownTimeout && options.shutdownTimeout > 0 && options.shutdownTimeout) ||
    DEFAULT_SHUTDOWN_TIMEOUT;
  client.close(timeout).then(
    (result) => {
      if (!result) {
        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.warn('We reached the timeout for emptying the request buffer, still exiting now!');
      }
      global.process.exit(1);
    },
    error => {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.error(error);
    },
  );
}


//# sourceMappingURL=errorhandling.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/integrations/utils/http.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cleanSpanDescription": () => (/* binding */ cleanSpanDescription),
/* harmony export */   "extractUrl": () => (/* binding */ extractUrl),
/* harmony export */   "isSentryRequest": () => (/* binding */ isSentryRequest),
/* harmony export */   "normalizeRequestArgs": () => (/* binding */ normalizeRequestArgs),
/* harmony export */   "urlToOptions": () => (/* binding */ urlToOptions)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/hub/esm/hub.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/misc.js");
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("url");
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_0__);





var NODE_VERSION = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.parseSemver)(process.versions.node);

/**
 * Checks whether given url points to Sentry server
 * @param url url to verify
 */
function isSentryRequest(url) {
  var dsn = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([_sentry_core__WEBPACK_IMPORTED_MODULE_3__.getCurrentHub, 'call', _ => _(), 'access', _2 => _2.getClient, 'call', _3 => _3(), 'optionalAccess', _4 => _4.getDsn, 'call', _5 => _5()]);
  return dsn ? url.includes(dsn.host) : false;
}

/**
 * Assemble a URL to be used for breadcrumbs and spans.
 *
 * @param requestOptions RequestOptions object containing the component parts for a URL
 * @returns Fully-formed URL
 */
function extractUrl(requestOptions) {
  var protocol = requestOptions.protocol || '';
  var hostname = requestOptions.hostname || requestOptions.host || '';
  // Don't log standard :80 (http) and :443 (https) ports to reduce the noise
  var port =
    !requestOptions.port || requestOptions.port === 80 || requestOptions.port === 443 ? '' : `:${requestOptions.port}`;
  var path = requestOptions.path ? requestOptions.path : '/';

  return `${protocol}//${hostname}${port}${path}`;
}

/**
 * Handle various edge cases in the span description (for spans representing http(s) requests).
 *
 * @param description current `description` property of the span representing the request
 * @param requestOptions Configuration data for the request
 * @param Request Request object
 *
 * @returns The cleaned description
 */
function cleanSpanDescription(
  description,
  requestOptions,
  request,
) {
  // nothing to clean
  if (!description) {
    return description;
  }

    let [method, requestUrl] = description.split(' ');

  // superagent sticks the protocol in a weird place (we check for host because if both host *and* protocol are missing,
  // we're likely dealing with an internal route and this doesn't apply)
  if (requestOptions.host && !requestOptions.protocol) {
        requestOptions.protocol = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([(request ), 'optionalAccess', _6 => _6.agent, 'optionalAccess', _7 => _7.protocol]); // worst comes to worst, this is undefined and nothing changes
    requestUrl = extractUrl(requestOptions);
  }

  // internal routes can end up starting with a triple slash rather than a single one
  if ((0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([requestUrl, 'optionalAccess', _8 => _8.startsWith, 'call', _9 => _9('///')])) {
    requestUrl = requestUrl.slice(2);
  }

  return `${method} ${requestUrl}`;
}

// the node types are missing a few properties which node's `urlToOptions` function spits out

/**
 * Convert a URL object into a RequestOptions object.
 *
 * Copied from Node's internals (where it's used in http(s).request() and http(s).get()), modified only to use the
 * RequestOptions type above.
 *
 * See https://github.com/nodejs/node/blob/master/lib/internal/url.js.
 */
function urlToOptions(url) {
  var options = {
    protocol: url.protocol,
    hostname:
      typeof url.hostname === 'string' && url.hostname.startsWith('[') ? url.hostname.slice(1, -1) : url.hostname,
    hash: url.hash,
    search: url.search,
    pathname: url.pathname,
    path: `${url.pathname || ''}${url.search || ''}`,
    href: url.href,
  };
  if (url.port !== '') {
    options.port = Number(url.port);
  }
  if (url.username || url.password) {
    options.auth = `${url.username}:${url.password}`;
  }
  return options;
}

/**
 * Normalize inputs to `http(s).request()` and `http(s).get()`.
 *
 * Legal inputs to `http(s).request()` and `http(s).get()` can take one of ten forms:
 *     [ RequestOptions | string | URL ],
 *     [ RequestOptions | string | URL, RequestCallback ],
 *     [ string | URL, RequestOptions ], and
 *     [ string | URL, RequestOptions, RequestCallback ].
 *
 * This standardizes to one of two forms: [ RequestOptions ] and [ RequestOptions, RequestCallback ]. A similar thing is
 * done as the first step of `http(s).request()` and `http(s).get()`; this just does it early so that we can interact
 * with the args in a standard way.
 *
 * @param requestArgs The inputs to `http(s).request()` or `http(s).get()`, as an array.
 *
 * @returns Equivalent args of the form [ RequestOptions ] or [ RequestOptions, RequestCallback ].
 */
function normalizeRequestArgs(
  httpModule,
  requestArgs,
) {
  let callback, requestOptions;

  // pop off the callback, if there is one
  if (typeof requestArgs[requestArgs.length - 1] === 'function') {
    callback = requestArgs.pop() ;
  }

  // create a RequestOptions object of whatever's at index 0
  if (typeof requestArgs[0] === 'string') {
    requestOptions = urlToOptions(new url__WEBPACK_IMPORTED_MODULE_0__.URL(requestArgs[0]));
  } else if (requestArgs[0] instanceof url__WEBPACK_IMPORTED_MODULE_0__.URL) {
    requestOptions = urlToOptions(requestArgs[0]);
  } else {
    requestOptions = requestArgs[0];
  }

  // if the options were given separately from the URL, fold them in
  if (requestArgs.length === 2) {
    requestOptions = { ...requestOptions, ...requestArgs[1] };
  }

  // Figure out the protocol if it's currently missing
  if (requestOptions.protocol === undefined) {
    // Worst case we end up populating protocol with undefined, which it already is
    
    // NOTE: Prior to Node 9, `https` used internals of `http` module, thus we don't patch it.
    // Because of that, we cannot rely on `httpModule` to provide us with valid protocol,
    // as it will always return `http`, even when using `https` module.
    //
    // See test/integrations/http.test.ts for more details on Node <=v8 protocol issue.
    if (NODE_VERSION.major && NODE_VERSION.major > 8) {
      requestOptions.protocol =
        (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([((0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([httpModule, 'optionalAccess', _10 => _10.globalAgent]) ), 'optionalAccess', _11 => _11.protocol]) ||
        (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([(requestOptions.agent ), 'optionalAccess', _12 => _12.protocol]) ||
        (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([(requestOptions._defaultAgent ), 'optionalAccess', _13 => _13.protocol]);
    } else {
      requestOptions.protocol =
        (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([(requestOptions.agent ), 'optionalAccess', _14 => _14.protocol]) ||
        (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([(requestOptions._defaultAgent ), 'optionalAccess', _15 => _15.protocol]) ||
        (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([((0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([httpModule, 'optionalAccess', _16 => _16.globalAgent]) ), 'optionalAccess', _17 => _17.protocol]);
    }
      }

  // return args in standardized form
  if (callback) {
    return [requestOptions, callback];
  } else {
    return [requestOptions];
  }
}


//# sourceMappingURL=http.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/module.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getModule": () => (/* binding */ getModule)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/path.js");


/** normalizes Windows paths */
function normalizePath(path) {
  return path
    .replace(/^[A-Z]:/, '') // remove Windows-style prefix
    .replace(/\\/g, '/'); // replace all `\` instances with `/`
}

/** Gets the module from a filename */
function getModule(filename) {
  if (!filename) {
    return;
  }

  var normalizedFilename = normalizePath(filename);

  // We could use optional chaining here but webpack does like that mixed with require
  var base = normalizePath(
    `${( true && __webpack_require__.c[__webpack_require__.s] && __webpack_require__.c[__webpack_require__.s].filename && (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.dirname)(__webpack_require__.c[__webpack_require__.s].filename)) || global.process.cwd()}/`,
  );

  // It's specifically a module
  var file = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.basename)(normalizedFilename, '.js');

  var path = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.dirname)(normalizedFilename);
  let n = path.lastIndexOf('/node_modules/');
  if (n > -1) {
    // /node_modules/ is 14 chars
    return `${path.substr(n + 14).replace(/\//g, '.')}:${file}`;
  }
  // Let's see if it's a part of the main module
  // To be a part of main module, it has to share the same base
  n = `${path}/`.lastIndexOf(base, 0);

  if (n === 0) {
    let moduleName = path.substr(base.length).replace(/\//g, '.');
    if (moduleName) {
      moduleName += ':';
    }
    moduleName += file;
    return moduleName;
  }
  return file;
}


//# sourceMappingURL=module.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/requestDataDeprecated.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "extractRequestData": () => (/* binding */ extractRequestData),
/* harmony export */   "parseRequest": () => (/* binding */ parseRequest)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/utils/esm/requestdata.js");
/* harmony import */ var cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("cookie");
/* harmony import */ var cookie__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(cookie__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("url");
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_1__);




/**
 * @deprecated `Handlers.ExpressRequest` is deprecated and will be removed in v8. Use `CrossPlatformRequest` instead.
 */

/**
 * Normalizes data from the request object, accounting for framework differences.
 *
 * @deprecated `Handlers.extractRequestData` is deprecated and will be removed in v8. Use `extractRequestData` instead.
 *
 * @param req The request object from which to extract data
 * @param keys An optional array of keys to include in the normalized data.
 * @returns An object containing normalized request data
 */
function extractRequestData(req, keys) {
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.extractRequestData)(req, { include: keys, deps: { cookie: cookie__WEBPACK_IMPORTED_MODULE_0__, url: url__WEBPACK_IMPORTED_MODULE_1__ } });
}

/**
 * Options deciding what parts of the request to use when enhancing an event
 *
 * @deprecated `Handlers.ParseRequestOptions` is deprecated and will be removed in v8. Use
 * `AddRequestDataToEventOptions` in `@sentry/utils` instead.
 */

/**
 * Enriches passed event with request data.
 *
 * @deprecated `Handlers.parseRequest` is deprecated and will be removed in v8. Use `addRequestDataToEvent` instead.
 *
 * @param event Will be mutated and enriched with req data
 * @param req Request object
 * @param options object containing flags to enable functionality
 * @hidden
 */
function parseRequest(event, req, options = {}) {
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.addRequestDataToEvent)(event, req, { include: options, deps: { cookie: cookie__WEBPACK_IMPORTED_MODULE_0__, url: url__WEBPACK_IMPORTED_MODULE_1__ } });
}


//# sourceMappingURL=requestDataDeprecated.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/sdk.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addRequestDataToEvent": () => (/* binding */ addRequestDataToEvent),
/* harmony export */   "close": () => (/* binding */ close),
/* harmony export */   "defaultIntegrations": () => (/* binding */ defaultIntegrations),
/* harmony export */   "defaultStackParser": () => (/* binding */ defaultStackParser),
/* harmony export */   "extractRequestData": () => (/* binding */ extractRequestData),
/* harmony export */   "flush": () => (/* binding */ flush),
/* harmony export */   "getSentryRelease": () => (/* binding */ getSentryRelease),
/* harmony export */   "init": () => (/* binding */ init),
/* harmony export */   "isAutoSessionTrackingEnabled": () => (/* binding */ isAutoSessionTrackingEnabled),
/* harmony export */   "lastEventId": () => (/* binding */ lastEventId)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("./node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("./node_modules/@sentry/core/esm/integrations/inboundfilters.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("./node_modules/@sentry/core/esm/integrations/functiontostring.js");
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("./node_modules/@sentry/hub/esm/hub.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__("./node_modules/@sentry/core/esm/integration.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__("./node_modules/@sentry/core/esm/sdk.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__("./node_modules/@sentry/utils/esm/stacktrace.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__("./node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__("./node_modules/@sentry/utils/esm/global.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__("./node_modules/@sentry/utils/esm/requestdata.js");
/* harmony import */ var cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("cookie");
/* harmony import */ var cookie__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(cookie__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var domain__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("domain");
/* harmony import */ var domain__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(domain__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("url");
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _client_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/node/esm/client.js");
/* harmony import */ var _integrations_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/index.js");
/* harmony import */ var _module_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/node/esm/module.js");
/* harmony import */ var _transports_index_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@sentry/node/esm/transports/index.js");
/* harmony import */ var _integrations_contextlines_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/contextlines.js");
/* harmony import */ var _integrations_console_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/console.js");
/* harmony import */ var _integrations_http_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/http.js");
/* harmony import */ var _integrations_onuncaughtexception_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/onuncaughtexception.js");
/* harmony import */ var _integrations_onunhandledrejection_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/onunhandledrejection.js");
/* harmony import */ var _integrations_linkederrors_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/linkederrors.js");
/* harmony import */ var _integrations_context_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("./node_modules/@sentry/node/esm/integrations/context.js");
/* harmony import */ var _transports_http_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("./node_modules/@sentry/node/esm/transports/http.js");




















var defaultIntegrations = [
  // Common
  new _sentry_core__WEBPACK_IMPORTED_MODULE_15__.InboundFilters(),
  new _sentry_core__WEBPACK_IMPORTED_MODULE_16__.FunctionToString(),
  new _integrations_contextlines_js__WEBPACK_IMPORTED_MODULE_7__.ContextLines(),
  // Native Wrappers
  new _integrations_console_js__WEBPACK_IMPORTED_MODULE_8__.Console(),
  new _integrations_http_js__WEBPACK_IMPORTED_MODULE_9__.Http(),
  // Global Handlers
  new _integrations_onuncaughtexception_js__WEBPACK_IMPORTED_MODULE_10__.OnUncaughtException(),
  new _integrations_onunhandledrejection_js__WEBPACK_IMPORTED_MODULE_11__.OnUnhandledRejection(),
  // Misc
  new _integrations_linkederrors_js__WEBPACK_IMPORTED_MODULE_12__.LinkedErrors(),
  new _integrations_context_js__WEBPACK_IMPORTED_MODULE_13__.Context(),
];

/**
 * The Sentry Node SDK Client.
 *
 * To use this SDK, call the {@link init} function as early as possible in the
 * main entry module. To set context information or send manual events, use the
 * provided methods.
 *
 * @example
 * ```
 *
 * const { init } = require('@sentry/node');
 *
 * init({
 *   dsn: '__DSN__',
 *   // ...
 * });
 * ```
 *
 * @example
 * ```
 *
 * const { configureScope } = require('@sentry/node');
 * configureScope((scope: Scope) => {
 *   scope.setExtra({ battery: 0.7 });
 *   scope.setTag({ user_mode: 'admin' });
 *   scope.setUser({ id: '4711' });
 * });
 * ```
 *
 * @example
 * ```
 *
 * const { addBreadcrumb } = require('@sentry/node');
 * addBreadcrumb({
 *   message: 'My Breadcrumb',
 *   // ...
 * });
 * ```
 *
 * @example
 * ```
 *
 * var Sentry = require('@sentry/node');
 * Sentry.captureMessage('Hello, world!');
 * Sentry.captureException(new Error('Good bye'));
 * Sentry.captureEvent({
 *   message: 'Manual',
 *   stacktrace: [
 *     // ...
 *   ],
 * });
 * ```
 *
 * @see {@link NodeOptions} for documentation on configuration options.
 */
function init(options = {}) {
  var carrier = (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_17__.getMainCarrier)();
  var autoloadedIntegrations = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_18__._optionalChain)([carrier, 'access', _ => _.__SENTRY__, 'optionalAccess', _2 => _2.integrations]) || [];

  options.defaultIntegrations =
    options.defaultIntegrations === false
      ? []
      : [
          ...(Array.isArray(options.defaultIntegrations) ? options.defaultIntegrations : defaultIntegrations),
          ...autoloadedIntegrations,
        ];

  if (options.dsn === undefined && process.env.SENTRY_DSN) {
    options.dsn = process.env.SENTRY_DSN;
  }

  if (options.tracesSampleRate === undefined && process.env.SENTRY_TRACES_SAMPLE_RATE) {
    var tracesSampleRate = parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE);
    if (isFinite(tracesSampleRate)) {
      options.tracesSampleRate = tracesSampleRate;
    }
  }

  if (options.release === undefined) {
    var detectedRelease = getSentryRelease();
    if (detectedRelease !== undefined) {
      options.release = detectedRelease;
    } else {
      // If release is not provided, then we should disable autoSessionTracking
      options.autoSessionTracking = false;
    }
  }

  if (options.environment === undefined && process.env.SENTRY_ENVIRONMENT) {
    options.environment = process.env.SENTRY_ENVIRONMENT;
  }

  if (options.autoSessionTracking === undefined && options.dsn !== undefined) {
    options.autoSessionTracking = true;
  }

    if (domain__WEBPACK_IMPORTED_MODULE_1__.active) {
    (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_17__.setHubOnCarrier)(carrier, (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_17__.getCurrentHub)());
  }

  // TODO(v7): Refactor this to reduce the logic above
  var clientOptions = {
    ...options,
    stackParser: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_19__.stackParserFromStackParserOptions)(options.stackParser || defaultStackParser),
    integrations: (0,_sentry_core__WEBPACK_IMPORTED_MODULE_20__.getIntegrationsToSetup)(options),
    transport: options.transport || _transports_http_js__WEBPACK_IMPORTED_MODULE_14__.makeNodeTransport,
  };

  (0,_sentry_core__WEBPACK_IMPORTED_MODULE_21__.initAndBind)(_client_js__WEBPACK_IMPORTED_MODULE_3__.NodeClient, clientOptions);

  if (options.autoSessionTracking) {
    startSessionTracking();
  }
}

/**
 * This is the getter for lastEventId.
 *
 * @returns The last event id of a captured event.
 */
function lastEventId() {
  return (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_17__.getCurrentHub)().lastEventId();
}

/**
 * Call `flush()` on the current client, if there is one. See {@link Client.flush}.
 *
 * @param timeout Maximum time in ms the client should wait to flush its event queue. Omitting this parameter will cause
 * the client to wait until all events are sent before resolving the promise.
 * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
 * doesn't (or if there's no client defined).
 */
async function flush(timeout) {
  var client = (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_17__.getCurrentHub)().getClient();
  if (client) {
    return client.flush(timeout);
  }
  (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_22__.logger.warn('Cannot flush events. No client defined.');
  return Promise.resolve(false);
}

/**
 * Call `close()` on the current client, if there is one. See {@link Client.close}.
 *
 * @param timeout Maximum time in ms the client should wait to flush its event queue before shutting down. Omitting this
 * parameter will cause the client to wait until all events are sent before disabling itself.
 * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
 * doesn't (or if there's no client defined).
 */
async function close(timeout) {
  var client = (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_17__.getCurrentHub)().getClient();
  if (client) {
    return client.close(timeout);
  }
  (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_22__.logger.warn('Cannot flush events and disable SDK. No client defined.');
  return Promise.resolve(false);
}

/**
 * Function that takes an instance of NodeClient and checks if autoSessionTracking option is enabled for that client
 */
function isAutoSessionTrackingEnabled(client) {
  if (client === undefined) {
    return false;
  }
  var clientOptions = client && client.getOptions();
  if (clientOptions && clientOptions.autoSessionTracking !== undefined) {
    return clientOptions.autoSessionTracking;
  }
  return false;
}

/**
 * Returns a release dynamically from environment variables.
 */
function getSentryRelease(fallback) {
  // Always read first as Sentry takes this as precedence
  if (process.env.SENTRY_RELEASE) {
    return process.env.SENTRY_RELEASE;
  }

  // This supports the variable that sentry-webpack-plugin injects
  var global = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_23__.getGlobalObject)();
  if (global.SENTRY_RELEASE && global.SENTRY_RELEASE.id) {
    return global.SENTRY_RELEASE.id;
  }

  return (
    // GitHub Actions - https://help.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables#default-environment-variables
    process.env.GITHUB_SHA ||
    // Netlify - https://docs.netlify.com/configure-builds/environment-variables/#build-metadata
    process.env.COMMIT_REF ||
    // Vercel - https://vercel.com/docs/v2/build-step#system-environment-variables
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.VERCEL_GITHUB_COMMIT_SHA ||
    process.env.VERCEL_GITLAB_COMMIT_SHA ||
    process.env.VERCEL_BITBUCKET_COMMIT_SHA ||
    // Zeit (now known as Vercel)
    process.env.ZEIT_GITHUB_COMMIT_SHA ||
    process.env.ZEIT_GITLAB_COMMIT_SHA ||
    process.env.ZEIT_BITBUCKET_COMMIT_SHA ||
    fallback
  );
}

/** Node.js stack parser */
var defaultStackParser = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_19__.createStackParser)((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_19__.nodeStackLineParser)(_module_js__WEBPACK_IMPORTED_MODULE_5__.getModule));

/**
 * Enable automatic Session Tracking for the node process.
 */
function startSessionTracking() {
  var hub = (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_17__.getCurrentHub)();
  hub.startSession();
  // Emitted in the case of healthy sessions, error of `mechanism.handled: true` and unhandledrejections because
  // The 'beforeExit' event is not emitted for conditions causing explicit termination,
  // such as calling process.exit() or uncaught exceptions.
  // Ref: https://nodejs.org/api/process.html#process_event_beforeexit
  process.on('beforeExit', () => {
    var session = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_18__._optionalChain)([hub, 'access', _3 => _3.getScope, 'call', _4 => _4(), 'optionalAccess', _5 => _5.getSession, 'call', _6 => _6()]);
    var terminalStates = ['exited', 'crashed'];
    // Only call endSession, if the Session exists on Scope and SessionStatus is not a
    // Terminal Status i.e. Exited or Crashed because
    // "When a session is moved away from ok it must not be updated anymore."
    // Ref: https://develop.sentry.dev/sdk/sessions/
    if (session && !terminalStates.includes(session.status)) hub.endSession();
  });
}

/**
 * Add data from the given request to the given event
 *
 * (Note that there is no sister function to this one in `@sentry/browser`, because the whole point of this wrapper is
 * to pass along injected dependencies, which isn't necessary in a browser context. Isomorphic packages like
 * `@sentry/nextjs` should export directly from `@sentry/utils` in their browser index file.)
 *
 * @param event The event to which the request data will be added
 * @param req Request object
 * @param options.include Flags to control what data is included
 * @hidden
 */
function addRequestDataToEvent(
  event,
  req,
  options,
) {
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_24__.addRequestDataToEvent)(event, req, {
    ...options,
    // We have to inject these node-only dependencies because we can't import them in `@sentry/utils`, where the
    // original function lives
    deps: { cookie: cookie__WEBPACK_IMPORTED_MODULE_0__, url: url__WEBPACK_IMPORTED_MODULE_2__ },
  });
}

/**
 * Normalize data from the request object, accounting for framework differences.
 *
 * (Note that there is no sister function to this one in `@sentry/browser`, because the whole point of this wrapper is
 * to inject dependencies, which isn't necessary in a browser context. Isomorphic packages like `@sentry/nextjs` should
 * export directly from `@sentry/utils` in their browser index file.)
 *
 * @param req The request object from which to extract data
 * @param options.keys An optional array of keys to include in the normalized data. Defaults to DEFAULT_REQUEST_KEYS if
 * not provided.
 * @returns An object containing normalized request data
 */
function extractRequestData(
  req,
  options

,
) {
  // We have to inject these node-only dependencies because we can't import them in `@sentry/utils`, where the original
  // function lives
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_24__.extractRequestData)(req, { ...options, deps: { cookie: cookie__WEBPACK_IMPORTED_MODULE_0__, url: url__WEBPACK_IMPORTED_MODULE_2__ } });
}


//# sourceMappingURL=sdk.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/transports/http.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "makeNodeTransport": () => (/* binding */ makeNodeTransport)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/utils/esm/buildPolyfills/_nullishCoalesce.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@sentry/core/esm/transports/base.js");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("http");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var https__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("https");
/* harmony import */ var https__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(https__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var stream__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("stream");
/* harmony import */ var stream__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(stream__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("url");
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var zlib__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("zlib");
/* harmony import */ var zlib__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(zlib__WEBPACK_IMPORTED_MODULE_4__);








// Estimated maximum size for reasonable standalone event
var GZIP_THRESHOLD = 1024 * 32;

/**
 * Gets a stream from a Uint8Array or string
 * Readable.from is ideal but was added in node.js v12.3.0 and v10.17.0
 */
function streamFromBody(body) {
  return new stream__WEBPACK_IMPORTED_MODULE_2__.Readable({
    read() {
      this.push(body);
      this.push(null);
    },
  });
}

/**
 * Creates a Transport that uses native the native 'http' and 'https' modules to send events to Sentry.
 */
function makeNodeTransport(options) {
  var urlSegments = new url__WEBPACK_IMPORTED_MODULE_3__.URL(options.url);
  var isHttps = urlSegments.protocol === 'https:';

  // Proxy prioritization: http => `options.proxy` | `process.env.http_proxy`
  // Proxy prioritization: https => `options.proxy` | `process.env.https_proxy` | `process.env.http_proxy`
  var proxy = applyNoProxyOption(
    urlSegments,
    options.proxy || (isHttps ? process.env.https_proxy : undefined) || process.env.http_proxy,
  );

  var nativeHttpModule = isHttps ? https__WEBPACK_IMPORTED_MODULE_1__ : http__WEBPACK_IMPORTED_MODULE_0__;

  // TODO(v7): Evaluate if we can set keepAlive to true. This would involve testing for memory leaks in older node
  // versions(>= 8) as they had memory leaks when using it: #2555
  var agent = proxy
    ? (new (__webpack_require__("https-proxy-agent"))(proxy) )
    : new nativeHttpModule.Agent({ keepAlive: false, maxSockets: 30, timeout: 2000 });

  var requestExecutor = createRequestExecutor(options, (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__._nullishCoalesce)(options.httpModule, () => ( nativeHttpModule)), agent);
  return (0,_sentry_core__WEBPACK_IMPORTED_MODULE_6__.createTransport)(options, requestExecutor);
}

/**
 * Honors the `no_proxy` env variable with the highest priority to allow for hosts exclusion.
 *
 * @param transportUrl The URL the transport intends to send events to.
 * @param proxy The client configured proxy.
 * @returns A proxy the transport should use.
 */
function applyNoProxyOption(transportUrlSegments, proxy) {
  const { no_proxy } = process.env;

  var urlIsExemptFromProxy =
    no_proxy &&
    no_proxy
      .split(',')
      .some(
        exemption => transportUrlSegments.host.endsWith(exemption) || transportUrlSegments.hostname.endsWith(exemption),
      );

  if (urlIsExemptFromProxy) {
    return undefined;
  } else {
    return proxy;
  }
}

/**
 * Creates a RequestExecutor to be used with `createTransport`.
 */
function createRequestExecutor(
  options,
  httpModule,
  agent,
) {
  const { hostname, pathname, port, protocol, search } = new url__WEBPACK_IMPORTED_MODULE_3__.URL(options.url);
  return function makeRequest(request) {
    return new Promise((resolve, reject) => {
      let body = streamFromBody(request.body);

      var headers = { ...options.headers };

      if (request.body.length > GZIP_THRESHOLD) {
        headers['content-encoding'] = 'gzip';
        body = body.pipe((0,zlib__WEBPACK_IMPORTED_MODULE_4__.createGzip)());
      }

      var req = httpModule.request(
        {
          method: 'POST',
          agent,
          headers,
          hostname,
          path: `${pathname}${search}`,
          port,
          protocol,
          ca: options.caCerts,
        },
        res => {
          res.on('data', () => {
            // Drain socket
          });

          res.on('end', () => {
            // Drain socket
          });

          res.setEncoding('utf8');

          // "Key-value pairs of header names and values. Header names are lower-cased."
          // https://nodejs.org/api/http.html#http_message_headers
          var retryAfterHeader = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__._nullishCoalesce)(res.headers['retry-after'], () => ( null));
          var rateLimitsHeader = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__._nullishCoalesce)(res.headers['x-sentry-rate-limits'], () => ( null));

          resolve({
            statusCode: res.statusCode,
            headers: {
              'retry-after': retryAfterHeader,
              'x-sentry-rate-limits': Array.isArray(rateLimitsHeader) ? rateLimitsHeader[0] : rateLimitsHeader,
            },
          });
        },
      );

      req.on('error', reject);
      body.pipe(req);
    });
  };
}


//# sourceMappingURL=http.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/transports/index.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "makeNodeTransport": () => (/* reexport safe */ _http_js__WEBPACK_IMPORTED_MODULE_0__.makeNodeTransport)
/* harmony export */ });
/* harmony import */ var _http_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/node/esm/transports/http.js");


;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/@sentry/node/esm/utils.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "deepReadDirSync": () => (/* binding */ deepReadDirSync)
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);



/**
 * Recursively read the contents of a directory.
 *
 * @param targetDir Absolute or relative path of the directory to scan. All returned paths will be relative to this
 * directory.
 * @returns Array holding all relative paths
 */
function deepReadDirSync(targetDir) {
  var targetDirAbsPath = path__WEBPACK_IMPORTED_MODULE_1__.resolve(targetDir);

  if (!fs__WEBPACK_IMPORTED_MODULE_0__.existsSync(targetDirAbsPath)) {
    throw new Error(`Cannot read contents of ${targetDirAbsPath}. Directory does not exist.`);
  }

  if (!fs__WEBPACK_IMPORTED_MODULE_0__.statSync(targetDirAbsPath).isDirectory()) {
    throw new Error(`Cannot read contents of ${targetDirAbsPath}, because it is not a directory.`);
  }

  // This does the same thing as its containing function, `deepReadDirSync` (except that - purely for convenience - it
  // deals in absolute paths rather than relative ones). We need this to be separate from the outer function to preserve
  // the difference between `targetDirAbsPath` and `currentDirAbsPath`.
  var deepReadCurrentDir = (currentDirAbsPath) => {
    return fs__WEBPACK_IMPORTED_MODULE_0__.readdirSync(currentDirAbsPath).reduce((absPaths, itemName) => {
      var itemAbsPath = path__WEBPACK_IMPORTED_MODULE_1__.join(currentDirAbsPath, itemName);

      if (fs__WEBPACK_IMPORTED_MODULE_0__.statSync(itemAbsPath).isDirectory()) {
        return [...absPaths, ...deepReadCurrentDir(itemAbsPath)];
      }

      return [...absPaths, itemAbsPath];
    }, []);
  };

  return deepReadCurrentDir(targetDirAbsPath).map(absPath => path__WEBPACK_IMPORTED_MODULE_1__.relative(targetDirAbsPath, absPath));
}


//# sourceMappingURL=utils.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/browser/backgroundtab.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registerBackgroundTabDetection": () => (/* binding */ registerBackgroundTabDetection)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/global.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/esm/utils.js");



var global = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();

/**
 * Add a listener that cancels and finishes a transaction when the global
 * document is hidden.
 */
function registerBackgroundTabDetection() {
  if (global && global.document) {
    global.document.addEventListener('visibilitychange', () => {
      var activeTransaction = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getActiveTransaction)() ;
      if (global.document.hidden && activeTransaction) {
        var statusType = 'cancelled';

        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
          _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.log(
            `[Tracing] Transaction: ${statusType} -> since tab moved to the background, op: ${activeTransaction.op}`,
          );
        // We should not set status if it is already set, this prevent important statuses like
        // error or data loss from being overwritten on transaction.
        if (!activeTransaction.status) {
          activeTransaction.setStatus(statusType);
        }
        activeTransaction.setTag('visibilitychange', 'document.hidden');
        activeTransaction.finish();
      }
    });
  } else {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
      _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.warn('[Tracing] Could not set up background tab detection due to lack of global document');
  }
}


//# sourceMappingURL=backgroundtab.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/browser/browsertracing.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BROWSER_TRACING_INTEGRATION_ID": () => (/* binding */ BROWSER_TRACING_INTEGRATION_ID),
/* harmony export */   "BrowserTracing": () => (/* binding */ BrowserTracing),
/* harmony export */   "getMetaContent": () => (/* binding */ getMetaContent)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/tracing.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/baggage.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/global.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/browser.js");
/* harmony import */ var _hubextensions_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./node_modules/@sentry/tracing/esm/hubextensions.js");
/* harmony import */ var _idletransaction_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/esm/idletransaction.js");
/* harmony import */ var _backgroundtab_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/backgroundtab.js");
/* harmony import */ var _metrics_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/metrics/index.js");
/* harmony import */ var _request_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/request.js");
/* harmony import */ var _router_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/router.js");










var BROWSER_TRACING_INTEGRATION_ID = 'BrowserTracing';

/** Options for Browser Tracing integration */

var DEFAULT_BROWSER_TRACING_OPTIONS = {
  idleTimeout: _idletransaction_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_IDLE_TIMEOUT,
  finalTimeout: _idletransaction_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_FINAL_TIMEOUT,
  markBackgroundTransactions: true,
  routingInstrumentation: _router_js__WEBPACK_IMPORTED_MODULE_1__.instrumentRoutingWithDefaults,
  startTransactionOnLocationChange: true,
  startTransactionOnPageLoad: true,
  _experiments: { enableLongTask: true },
  ..._request_js__WEBPACK_IMPORTED_MODULE_2__.defaultRequestInstrumentationOptions,
};

/**
 * The Browser Tracing integration automatically instruments browser pageload/navigation
 * actions as transactions, and captures requests, metrics and errors as spans.
 *
 * The integration can be configured with a variety of options, and can be extended to use
 * any routing library. This integration uses {@see IdleTransaction} to create transactions.
 */
class BrowserTracing  {
  // This class currently doesn't have a static `id` field like the other integration classes, because it prevented
  // @sentry/tracing from being treeshaken. Tree shakers do not like static fields, because they behave like side effects.
  // TODO: Come up with a better plan, than using static fields on integration classes, and use that plan on all
  // integrations.

  /** Browser Tracing integration options */
  

  /**
   * @inheritDoc
   */
   __init() {this.name = BROWSER_TRACING_INTEGRATION_ID;}

   constructor(_options) {;BrowserTracing.prototype.__init.call(this);
    let tracingOrigins = _request_js__WEBPACK_IMPORTED_MODULE_2__.defaultRequestInstrumentationOptions.tracingOrigins;
    // NOTE: Logger doesn't work in constructors, as it's initialized after integrations instances
    if (_options) {
      if (_options.tracingOrigins && Array.isArray(_options.tracingOrigins)) {
        tracingOrigins = _options.tracingOrigins;
      } else {
        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && (this._emitOptionsWarning = true);
      }
    }

    this.options = {
      ...DEFAULT_BROWSER_TRACING_OPTIONS,
      ..._options,
      tracingOrigins,
    };

    const { _metricOptions } = this.options;
    (0,_metrics_index_js__WEBPACK_IMPORTED_MODULE_3__.startTrackingWebVitals)(_metricOptions && _metricOptions._reportAllChanges);
    if ((0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._optionalChain)([this, 'access', _2 => _2.options, 'access', _3 => _3._experiments, 'optionalAccess', _4 => _4.enableLongTask])) {
      (0,_metrics_index_js__WEBPACK_IMPORTED_MODULE_3__.startTrackingLongTasks)();
    }
  }

  /**
   * @inheritDoc
   */
   setupOnce(_, getCurrentHub) {
    this._getCurrentHub = getCurrentHub;

    if (this._emitOptionsWarning) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
        _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.warn(
          '[Tracing] You need to define `tracingOrigins` in the options. Set an array of urls or patterns to trace.',
        );
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
        _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.warn(
          `[Tracing] We added a reasonable default for you: ${_request_js__WEBPACK_IMPORTED_MODULE_2__.defaultRequestInstrumentationOptions.tracingOrigins}`,
        );
    }

        const {
      routingInstrumentation: instrumentRouting,
      startTransactionOnLocationChange,
      startTransactionOnPageLoad,
      markBackgroundTransactions,
      traceFetch,
      traceXHR,
      tracingOrigins,
      shouldCreateSpanForRequest,
    } = this.options;

    instrumentRouting(
      (context) => this._createRouteTransaction(context),
      startTransactionOnPageLoad,
      startTransactionOnLocationChange,
    );

    if (markBackgroundTransactions) {
      (0,_backgroundtab_js__WEBPACK_IMPORTED_MODULE_6__.registerBackgroundTabDetection)();
    }

    (0,_request_js__WEBPACK_IMPORTED_MODULE_2__.instrumentOutgoingRequests)({ traceFetch, traceXHR, tracingOrigins, shouldCreateSpanForRequest });
  }

  /** Create routing idle transaction. */
   _createRouteTransaction(context) {
    if (!this._getCurrentHub) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
        _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.warn(`[Tracing] Did not create ${context.op} transaction because _getCurrentHub is invalid.`);
      return undefined;
    }

        const { beforeNavigate, idleTimeout, finalTimeout } = this.options;

    var isPageloadTransaction = context.op === 'pageload';

    var sentryTraceMetaTagValue = isPageloadTransaction ? getMetaContent('sentry-trace') : null;
    var baggageMetaTagValue = isPageloadTransaction ? getMetaContent('baggage') : null;

    var traceParentData = sentryTraceMetaTagValue ? (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_7__.extractTraceparentData)(sentryTraceMetaTagValue) : undefined;
    var dynamicSamplingContext = baggageMetaTagValue
      ? (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_8__.baggageHeaderToDynamicSamplingContext)(baggageMetaTagValue)
      : undefined;

    var expandedContext = {
      ...context,
      ...traceParentData,
      metadata: {
        ...context.metadata,
        dynamicSamplingContext: traceParentData && !dynamicSamplingContext ? {} : dynamicSamplingContext,
      },
      trimEnd: true,
    };

    var modifiedContext = typeof beforeNavigate === 'function' ? beforeNavigate(expandedContext) : expandedContext;

    // For backwards compatibility reasons, beforeNavigate can return undefined to "drop" the transaction (prevent it
    // from being sent to Sentry).
    var finalContext = modifiedContext === undefined ? { ...expandedContext, sampled: false } : modifiedContext;

    // If `beforeNavigate` set a custom name, record that fact
    finalContext.metadata =
      finalContext.name !== expandedContext.name
        ? { ...finalContext.metadata, source: 'custom' }
        : finalContext.metadata;

    if (finalContext.sampled === false) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
        _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log(`[Tracing] Will not send ${finalContext.op} transaction because of beforeNavigate.`);
    }

    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log(`[Tracing] Starting ${finalContext.op} transaction on scope`);

    var hub = this._getCurrentHub();
    const { location } = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_9__.getGlobalObject)() ;

    var idleTransaction = (0,_hubextensions_js__WEBPACK_IMPORTED_MODULE_10__.startIdleTransaction)(
      hub,
      finalContext,
      idleTimeout,
      finalTimeout,
      true,
      { location }, // for use in the tracesSampler
    );
    idleTransaction.registerBeforeFinishCallback(transaction => {
      (0,_metrics_index_js__WEBPACK_IMPORTED_MODULE_3__.addPerformanceEntries)(transaction);
      transaction.setTag(
        'sentry_reportAllChanges',
        Boolean(this.options._metricOptions && this.options._metricOptions._reportAllChanges),
      );
    });

    return idleTransaction ;
  }
}

/** Returns the value of a meta tag */
function getMetaContent(metaName) {
  // Can't specify generic to `getDomElement` because tracing can be used
  // in a variety of environments, have to disable `no-unsafe-member-access`
  // as a result.
  var metaTag = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_11__.getDomElement)(`meta[name=${metaName}]`);
    return metaTag ? metaTag.getAttribute('content') : null;
}


//# sourceMappingURL=browsertracing.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/browser/metrics/index.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_addMeasureSpans": () => (/* binding */ _addMeasureSpans),
/* harmony export */   "_addResourceSpans": () => (/* binding */ _addResourceSpans),
/* harmony export */   "addPerformanceEntries": () => (/* binding */ addPerformanceEntries),
/* harmony export */   "startTrackingLongTasks": () => (/* binding */ startTrackingLongTasks),
/* harmony export */   "startTrackingWebVitals": () => (/* binding */ startTrackingWebVitals)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/buildPolyfills/_nullishCoalesce.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/global.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/time.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/browser.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/esm/utils.js");
/* harmony import */ var _web_vitals_getCLS_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/getCLS.js");
/* harmony import */ var _web_vitals_getFID_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/getFID.js");
/* harmony import */ var _web_vitals_getLCP_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/getLCP.js");
/* harmony import */ var _web_vitals_lib_getVisibilityWatcher_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/getVisibilityWatcher.js");
/* harmony import */ var _web_vitals_lib_observe_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/observe.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/metrics/utils.js");










var global = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();

function getBrowserPerformanceAPI() {
  return global && global.addEventListener && global.performance;
}

let _performanceCursor = 0;

let _measurements = {};
let _lcpEntry;
let _clsEntry;

/**
 * Start tracking web vitals
 */
function startTrackingWebVitals(reportAllChanges = false) {
  var performance = getBrowserPerformanceAPI();
  if (performance && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.browserPerformanceTimeOrigin) {
    if (performance.mark) {
      global.performance.mark('sentry-tracing-init');
    }
    _trackCLS();
    _trackLCP(reportAllChanges);
    _trackFID();
  }
}

/**
 * Start tracking long tasks.
 */
function startTrackingLongTasks() {
  var entryHandler = (entry) => {
    var transaction = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.getActiveTransaction)() ;
    if (!transaction) {
      return;
    }
    var startTime = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.msToSec)((_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.browserPerformanceTimeOrigin ) + entry.startTime);
    var duration = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.msToSec)(entry.duration);
    transaction.startChild({
      description: 'Main UI thread blocked',
      op: 'ui.long-task',
      startTimestamp: startTime,
      endTimestamp: startTime + duration,
    });
  };

  (0,_web_vitals_lib_observe_js__WEBPACK_IMPORTED_MODULE_3__.observe)('longtask', entryHandler);
}

/** Starts tracking the Cumulative Layout Shift on the current page. */
function _trackCLS() {
  // See:
  // https://web.dev/evolving-cls/
  // https://web.dev/cls-web-tooling/
  (0,_web_vitals_getCLS_js__WEBPACK_IMPORTED_MODULE_4__.getCLS)(metric => {
    var entry = metric.entries.pop();
    if (!entry) {
      return;
    }

    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log('[Measurements] Adding CLS');
    _measurements['cls'] = { value: metric.value, unit: '' };
    _clsEntry = entry ;
  });
}

/** Starts tracking the Largest Contentful Paint on the current page. */
function _trackLCP(reportAllChanges) {
  (0,_web_vitals_getLCP_js__WEBPACK_IMPORTED_MODULE_6__.getLCP)(metric => {
    var entry = metric.entries.pop();
    if (!entry) {
      return;
    }

    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log('[Measurements] Adding LCP');
    _measurements['lcp'] = { value: metric.value, unit: 'millisecond' };
    _lcpEntry = entry ;
  }, reportAllChanges);
}

/** Starts tracking the First Input Delay on the current page. */
function _trackFID() {
  (0,_web_vitals_getFID_js__WEBPACK_IMPORTED_MODULE_7__.getFID)(metric => {
    var entry = metric.entries.pop();
    if (!entry) {
      return;
    }

    var timeOrigin = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.msToSec)(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.browserPerformanceTimeOrigin );
    var startTime = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.msToSec)(entry.startTime);
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log('[Measurements] Adding FID');
    _measurements['fid'] = { value: metric.value, unit: 'millisecond' };
    _measurements['mark.fid'] = { value: timeOrigin + startTime, unit: 'second' };
  });
}

/** Add performance related spans to a transaction */
function addPerformanceEntries(transaction) {
  var performance = getBrowserPerformanceAPI();
  if (!performance || !global.performance.getEntries || !_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.browserPerformanceTimeOrigin) {
    // Gatekeeper if performance API not available
    return;
  }

  (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log('[Tracing] Adding & adjusting spans using Performance API');
  var timeOrigin = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.msToSec)(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.browserPerformanceTimeOrigin);

  var performanceEntries = performance.getEntries();

  let responseStartTimestamp;
  let requestStartTimestamp;

    performanceEntries.slice(_performanceCursor).forEach((entry) => {
    var startTime = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.msToSec)(entry.startTime);
    var duration = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.msToSec)(entry.duration);

    if (transaction.op === 'navigation' && timeOrigin + startTime < transaction.startTimestamp) {
      return;
    }

    switch (entry.entryType) {
      case 'navigation': {
        _addNavigationSpans(transaction, entry, timeOrigin);
        responseStartTimestamp = timeOrigin + (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.msToSec)(entry.responseStart);
        requestStartTimestamp = timeOrigin + (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.msToSec)(entry.requestStart);
        break;
      }
      case 'mark':
      case 'paint':
      case 'measure': {
        _addMeasureSpans(transaction, entry, startTime, duration, timeOrigin);

        // capture web vitals
        var firstHidden = (0,_web_vitals_lib_getVisibilityWatcher_js__WEBPACK_IMPORTED_MODULE_8__.getVisibilityWatcher)();
        // Only report if the page wasn't hidden prior to the web vital.
        var shouldRecord = entry.startTime < firstHidden.firstHiddenTime;

        if (entry.name === 'first-paint' && shouldRecord) {
          (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log('[Measurements] Adding FP');
          _measurements['fp'] = { value: entry.startTime, unit: 'millisecond' };
        }
        if (entry.name === 'first-contentful-paint' && shouldRecord) {
          (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log('[Measurements] Adding FCP');
          _measurements['fcp'] = { value: entry.startTime, unit: 'millisecond' };
        }
        break;
      }
      case 'resource': {
        var resourceName = (entry.name ).replace(global.location.origin, '');
        _addResourceSpans(transaction, entry, resourceName, startTime, duration, timeOrigin);
        break;
      }
      default:
      // Ignore other entry types.
    }
  });

  _performanceCursor = Math.max(performanceEntries.length - 1, 0);

  _trackNavigator(transaction);

  // Measurements are only available for pageload transactions
  if (transaction.op === 'pageload') {
    // Generate TTFB (Time to First Byte), which measured as the time between the beginning of the transaction and the
    // start of the response in milliseconds
    if (typeof responseStartTimestamp === 'number') {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log('[Measurements] Adding TTFB');
      _measurements['ttfb'] = {
        value: (responseStartTimestamp - transaction.startTimestamp) * 1000,
        unit: 'millisecond',
      };

      if (typeof requestStartTimestamp === 'number' && requestStartTimestamp <= responseStartTimestamp) {
        // Capture the time spent making the request and receiving the first byte of the response.
        // This is the time between the start of the request and the start of the response in milliseconds.
        _measurements['ttfb.requestTime'] = {
          value: (responseStartTimestamp - requestStartTimestamp) * 1000,
          unit: 'millisecond',
        };
      }
    }

    ['fcp', 'fp', 'lcp'].forEach(name => {
      if (!_measurements[name] || timeOrigin >= transaction.startTimestamp) {
        return;
      }
      // The web vitals, fcp, fp, lcp, and ttfb, all measure relative to timeOrigin.
      // Unfortunately, timeOrigin is not captured within the transaction span data, so these web vitals will need
      // to be adjusted to be relative to transaction.startTimestamp.
      var oldValue = _measurements[name].value;
      var measurementTimestamp = timeOrigin + (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.msToSec)(oldValue);

      // normalizedValue should be in milliseconds
      var normalizedValue = Math.abs((measurementTimestamp - transaction.startTimestamp) * 1000);
      var delta = normalizedValue - oldValue;

      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
        _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log(`[Measurements] Normalized ${name} from ${oldValue} to ${normalizedValue} (${delta})`);
      _measurements[name].value = normalizedValue;
    });

    var fidMark = _measurements['mark.fid'];
    if (fidMark && _measurements['fid']) {
      // create span for FID
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_9__._startChild)(transaction, {
        description: 'first input delay',
        endTimestamp: fidMark.value + (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.msToSec)(_measurements['fid'].value),
        op: 'web.vitals',
        startTimestamp: fidMark.value,
      });

      // Delete mark.fid as we don't want it to be part of final payload
      delete _measurements['mark.fid'];
    }

    // If FCP is not recorded we should not record the cls value
    // according to the new definition of CLS.
    if (!('fcp' in _measurements)) {
      delete _measurements.cls;
    }

    Object.keys(_measurements).forEach(measurementName => {
      transaction.setMeasurement(
        measurementName,
        _measurements[measurementName].value,
        _measurements[measurementName].unit,
      );
    });

    _tagMetricInfo(transaction);
  }

  _lcpEntry = undefined;
  _clsEntry = undefined;
  _measurements = {};
}

/** Create measure related spans */
function _addMeasureSpans(
  transaction,
    entry,
  startTime,
  duration,
  timeOrigin,
) {
  var measureStartTimestamp = timeOrigin + startTime;
  var measureEndTimestamp = measureStartTimestamp + duration;

  (0,_utils_js__WEBPACK_IMPORTED_MODULE_9__._startChild)(transaction, {
    description: entry.name ,
    endTimestamp: measureEndTimestamp,
    op: entry.entryType ,
    startTimestamp: measureStartTimestamp,
  });

  return measureStartTimestamp;
}

/** Instrument navigation entries */
function _addNavigationSpans(transaction, entry, timeOrigin) {
  ['unloadEvent', 'redirect', 'domContentLoadedEvent', 'loadEvent', 'connect'].forEach(event => {
    _addPerformanceNavigationTiming(transaction, entry, event, timeOrigin);
  });
  _addPerformanceNavigationTiming(transaction, entry, 'secureConnection', timeOrigin, 'TLS/SSL', 'connectEnd');
  _addPerformanceNavigationTiming(transaction, entry, 'fetch', timeOrigin, 'cache', 'domainLookupStart');
  _addPerformanceNavigationTiming(transaction, entry, 'domainLookup', timeOrigin, 'DNS');
  _addRequest(transaction, entry, timeOrigin);
}

/** Create performance navigation related spans */
function _addPerformanceNavigationTiming(
  transaction,
    entry,
  event,
  timeOrigin,
  description,
  eventEnd,
) {
  var end = eventEnd ? (entry[eventEnd] ) : (entry[`${event}End`] );
  var start = entry[`${event}Start`] ;
  if (!start || !end) {
    return;
  }
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_9__._startChild)(transaction, {
    op: 'browser',
    description: (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_10__._nullishCoalesce)(description, () => ( event)),
    startTimestamp: timeOrigin + (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.msToSec)(start),
    endTimestamp: timeOrigin + (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.msToSec)(end),
  });
}

/** Create request and response related spans */
function _addRequest(transaction, entry, timeOrigin) {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_9__._startChild)(transaction, {
    op: 'browser',
    description: 'request',
    startTimestamp: timeOrigin + (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.msToSec)(entry.requestStart ),
    endTimestamp: timeOrigin + (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.msToSec)(entry.responseEnd ),
  });

  (0,_utils_js__WEBPACK_IMPORTED_MODULE_9__._startChild)(transaction, {
    op: 'browser',
    description: 'response',
    startTimestamp: timeOrigin + (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.msToSec)(entry.responseStart ),
    endTimestamp: timeOrigin + (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.msToSec)(entry.responseEnd ),
  });
}

/** Create resource-related spans */
function _addResourceSpans(
  transaction,
  entry,
  resourceName,
  startTime,
  duration,
  timeOrigin,
) {
  // we already instrument based on fetch and xhr, so we don't need to
  // duplicate spans here.
  if (entry.initiatorType === 'xmlhttprequest' || entry.initiatorType === 'fetch') {
    return;
  }

    var data = {};
  if ('transferSize' in entry) {
    data['Transfer Size'] = entry.transferSize;
  }
  if ('encodedBodySize' in entry) {
    data['Encoded Body Size'] = entry.encodedBodySize;
  }
  if ('decodedBodySize' in entry) {
    data['Decoded Body Size'] = entry.decodedBodySize;
  }

  var startTimestamp = timeOrigin + startTime;
  var endTimestamp = startTimestamp + duration;

  (0,_utils_js__WEBPACK_IMPORTED_MODULE_9__._startChild)(transaction, {
    description: resourceName,
    endTimestamp,
    op: entry.initiatorType ? `resource.${entry.initiatorType}` : 'resource',
    startTimestamp,
    data,
  });
}

/**
 * Capture the information of the user agent.
 */
function _trackNavigator(transaction) {
  var navigator = global.navigator ;
  if (!navigator) {
    return;
  }

  // track network connectivity
  var connection = navigator.connection;
  if (connection) {
    if (connection.effectiveType) {
      transaction.setTag('effectiveConnectionType', connection.effectiveType);
    }

    if (connection.type) {
      transaction.setTag('connectionType', connection.type);
    }

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_9__.isMeasurementValue)(connection.rtt)) {
      _measurements['connection.rtt'] = { value: connection.rtt, unit: 'millisecond' };
    }

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_9__.isMeasurementValue)(connection.downlink)) {
      _measurements['connection.downlink'] = { value: connection.downlink, unit: '' }; // unit is empty string for now, while relay doesn't support download speed units
    }
  }

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_9__.isMeasurementValue)(navigator.deviceMemory)) {
    transaction.setTag('deviceMemory', `${navigator.deviceMemory} GB`);
  }

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_9__.isMeasurementValue)(navigator.hardwareConcurrency)) {
    transaction.setTag('hardwareConcurrency', String(navigator.hardwareConcurrency));
  }
}

/** Add LCP / CLS data to transaction to allow debugging */
function _tagMetricInfo(transaction) {
  if (_lcpEntry) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log('[Measurements] Adding LCP Data');

    // Capture Properties of the LCP element that contributes to the LCP.

    if (_lcpEntry.element) {
      transaction.setTag('lcp.element', (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_11__.htmlTreeAsString)(_lcpEntry.element));
    }

    if (_lcpEntry.id) {
      transaction.setTag('lcp.id', _lcpEntry.id);
    }

    if (_lcpEntry.url) {
      // Trim URL to the first 200 characters.
      transaction.setTag('lcp.url', _lcpEntry.url.trim().slice(0, 200));
    }

    transaction.setTag('lcp.size', _lcpEntry.size);
  }

  // See: https://developer.mozilla.org/en-US/docs/Web/API/LayoutShift
  if (_clsEntry && _clsEntry.sources) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log('[Measurements] Adding CLS Data');
    _clsEntry.sources.forEach((source, index) =>
      transaction.setTag(`cls.source.${index + 1}`, (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_11__.htmlTreeAsString)(source.node)),
    );
  }
}


//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/browser/metrics/utils.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_startChild": () => (/* binding */ _startChild),
/* harmony export */   "isMeasurementValue": () => (/* binding */ isMeasurementValue)
/* harmony export */ });
/**
 * Checks if a given value is a valid measurement value.
 */
function isMeasurementValue(value) {
  return typeof value === 'number' && isFinite(value);
}

/**
 * Helper function to start child on transactions. This function will make sure that the transaction will
 * use the start timestamp of the created child span if it is earlier than the transactions actual
 * start timestamp.
 */
function _startChild(transaction, { startTimestamp, ...ctx }) {
  if (startTimestamp && transaction.startTimestamp > startTimestamp) {
    transaction.startTimestamp = startTimestamp;
  }

  return transaction.startChild({
    startTimestamp,
    ...ctx,
  });
}


//# sourceMappingURL=utils.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/browser/request.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DEFAULT_TRACING_ORIGINS": () => (/* binding */ DEFAULT_TRACING_ORIGINS),
/* harmony export */   "defaultRequestInstrumentationOptions": () => (/* binding */ defaultRequestInstrumentationOptions),
/* harmony export */   "fetchCallback": () => (/* binding */ fetchCallback),
/* harmony export */   "instrumentOutgoingRequests": () => (/* binding */ instrumentOutgoingRequests),
/* harmony export */   "xhrCallback": () => (/* binding */ xhrCallback)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/string.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/instrument.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/baggage.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/is.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/esm/utils.js");



var DEFAULT_TRACING_ORIGINS = ['localhost', /^\//];

/** Options for Request Instrumentation */

var defaultRequestInstrumentationOptions = {
  traceFetch: true,
  traceXHR: true,
  tracingOrigins: DEFAULT_TRACING_ORIGINS,
};

/** Registers span creators for xhr and fetch requests  */
function instrumentOutgoingRequests(_options) {
    const { traceFetch, traceXHR, tracingOrigins, shouldCreateSpanForRequest } = {
    ...defaultRequestInstrumentationOptions,
    ..._options,
  };

  // We should cache url -> decision so that we don't have to compute
  // regexp everytime we create a request.
  var urlMap = {};

  var defaultShouldCreateSpan = (url) => {
    if (urlMap[url]) {
      return urlMap[url];
    }
    var origins = tracingOrigins;
    urlMap[url] =
      origins.some((origin) => (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.isMatchingPattern)(url, origin)) &&
      !(0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.isMatchingPattern)(url, 'sentry_key');
    return urlMap[url];
  };

  // We want that our users don't have to re-implement shouldCreateSpanForRequest themselves
  // That's why we filter out already unwanted Spans from tracingOrigins
  let shouldCreateSpan = defaultShouldCreateSpan;
  if (typeof shouldCreateSpanForRequest === 'function') {
    shouldCreateSpan = (url) => {
      return defaultShouldCreateSpan(url) && shouldCreateSpanForRequest(url);
    };
  }

  var spans = {};

  if (traceFetch) {
    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.addInstrumentationHandler)('fetch', (handlerData) => {
      fetchCallback(handlerData, shouldCreateSpan, spans);
    });
  }

  if (traceXHR) {
    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.addInstrumentationHandler)('xhr', (handlerData) => {
      xhrCallback(handlerData, shouldCreateSpan, spans);
    });
  }
}

/**
 * Create and track fetch request spans
 */
function fetchCallback(
  handlerData,
  shouldCreateSpan,
  spans,
) {
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.hasTracingEnabled)() || !(handlerData.fetchData && shouldCreateSpan(handlerData.fetchData.url))) {
    return;
  }

  if (handlerData.endTimestamp) {
    var spanId = handlerData.fetchData.__span;
    if (!spanId) return;

    var span = spans[spanId];
    if (span) {
      if (handlerData.response) {
        // TODO (kmclb) remove this once types PR goes through
                span.setHttpStatus(handlerData.response.status);
      } else if (handlerData.error) {
        span.setStatus('internal_error');
      }
      span.finish();

            delete spans[spanId];
    }
    return;
  }

  var activeTransaction = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.getActiveTransaction)();
  if (activeTransaction) {
    var span = activeTransaction.startChild({
      data: {
        ...handlerData.fetchData,
        type: 'fetch',
      },
      description: `${handlerData.fetchData.method} ${handlerData.fetchData.url}`,
      op: 'http.client',
    });

    handlerData.fetchData.__span = span.spanId;
    spans[span.spanId] = span;

    var request = handlerData.args[0];

    // In case the user hasn't set the second argument of a fetch call we default it to `{}`.
    handlerData.args[1] = handlerData.args[1] || {};

        var options = handlerData.args[1];

    options.headers = addTracingHeadersToFetchRequest(
      request,
      activeTransaction.getDynamicSamplingContext(),
      span,
      options,
    );

    activeTransaction.metadata.propagations += 1;
  }
}

function addTracingHeadersToFetchRequest(
  request,
  dynamicSamplingContext,
  span,
  options

,
) {
  var sentryBaggageHeader = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.dynamicSamplingContextToSentryBaggageHeader)(dynamicSamplingContext);
  var sentryTraceHeader = span.toTraceparent();

  var headers =
    typeof Request !== 'undefined' && (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.isInstanceOf)(request, Request) ? (request ).headers : options.headers;

  if (!headers) {
    return { 'sentry-trace': sentryTraceHeader, baggage: sentryBaggageHeader };
  } else if (typeof Headers !== 'undefined' && (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.isInstanceOf)(headers, Headers)) {
    var newHeaders = new Headers(headers );

    newHeaders.append('sentry-trace', sentryTraceHeader);

    if (sentryBaggageHeader) {
      // If the same header is appended miultiple times the browser will merge the values into a single request header.
      // Its therefore safe to simply push a "baggage" entry, even though there might already be another baggage header.
      newHeaders.append(_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.BAGGAGE_HEADER_NAME, sentryBaggageHeader);
    }

    return newHeaders ;
  } else if (Array.isArray(headers)) {
    var newHeaders = [...headers, ['sentry-trace', sentryTraceHeader]];

    if (sentryBaggageHeader) {
      // If there are multiple entries with the same key, the browser will merge the values into a single request header.
      // Its therefore safe to simply push a "baggage" entry, even though there might already be another baggage header.
      newHeaders.push([_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.BAGGAGE_HEADER_NAME, sentryBaggageHeader]);
    }

    return newHeaders;
  } else {
    var existingBaggageHeader = 'baggage' in headers ? headers.baggage : undefined;
    var newBaggageHeaders = [];

    if (Array.isArray(existingBaggageHeader)) {
      newBaggageHeaders.push(...existingBaggageHeader);
    } else if (existingBaggageHeader) {
      newBaggageHeaders.push(existingBaggageHeader);
    }

    if (sentryBaggageHeader) {
      newBaggageHeaders.push(sentryBaggageHeader);
    }

    return {
      ...(headers ),
      'sentry-trace': sentryTraceHeader,
      baggage: newBaggageHeaders.length > 0 ? newBaggageHeaders.join(',') : undefined,
    };
  }
}

/**
 * Create and track xhr request spans
 */
function xhrCallback(
  handlerData,
  shouldCreateSpan,
  spans,
) {
  if (
    !(0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.hasTracingEnabled)() ||
    (handlerData.xhr && handlerData.xhr.__sentry_own_request__) ||
    !(handlerData.xhr && handlerData.xhr.__sentry_xhr__ && shouldCreateSpan(handlerData.xhr.__sentry_xhr__.url))
  ) {
    return;
  }

  var xhr = handlerData.xhr.__sentry_xhr__;

  // check first if the request has finished and is tracked by an existing span which should now end
  if (handlerData.endTimestamp) {
    var spanId = handlerData.xhr.__sentry_xhr_span_id__;
    if (!spanId) return;

    var span = spans[spanId];
    if (span) {
      span.setHttpStatus(xhr.status_code);
      span.finish();

            delete spans[spanId];
    }
    return;
  }

  // if not, create a new span to track it
  var activeTransaction = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.getActiveTransaction)();
  if (activeTransaction) {
    var span = activeTransaction.startChild({
      data: {
        ...xhr.data,
        type: 'xhr',
        method: xhr.method,
        url: xhr.url,
      },
      description: `${xhr.method} ${xhr.url}`,
      op: 'http.client',
    });

    handlerData.xhr.__sentry_xhr_span_id__ = span.spanId;
    spans[handlerData.xhr.__sentry_xhr_span_id__] = span;

    if (handlerData.xhr.setRequestHeader) {
      try {
        handlerData.xhr.setRequestHeader('sentry-trace', span.toTraceparent());

        var dynamicSamplingContext = activeTransaction.getDynamicSamplingContext();
        var sentryBaggageHeader = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.dynamicSamplingContextToSentryBaggageHeader)(dynamicSamplingContext);

        if (sentryBaggageHeader) {
          // From MDN: "If this method is called several times with the same header, the values are merged into one single request header."
          // We can therefore simply set a baggage header without checking what was there before
          // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader
          handlerData.xhr.setRequestHeader(_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.BAGGAGE_HEADER_NAME, sentryBaggageHeader);
        }

        activeTransaction.metadata.propagations += 1;
      } catch (_) {
        // Error: InvalidStateError: Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.
      }
    }
  }
}


//# sourceMappingURL=request.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/browser/router.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "instrumentRoutingWithDefaults": () => (/* binding */ instrumentRoutingWithDefaults)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/global.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/instrument.js");


var global = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();

/**
 * Default function implementing pageload and navigation transactions
 */
function instrumentRoutingWithDefaults(
  customStartTransaction,
  startTransactionOnPageLoad = true,
  startTransactionOnLocationChange = true,
) {
  if (!global || !global.location) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.warn('Could not initialize routing instrumentation due to invalid location');
    return;
  }

  let startingUrl = global.location.href;

  let activeTransaction;
  if (startTransactionOnPageLoad) {
    activeTransaction = customStartTransaction({
      name: global.location.pathname,
      op: 'pageload',
      metadata: { source: 'url' },
    });
  }

  if (startTransactionOnLocationChange) {
    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.addInstrumentationHandler)('history', ({ to, from }) => {
      /**
       * This early return is there to account for some cases where a navigation transaction starts right after
       * long-running pageload. We make sure that if `from` is undefined and a valid `startingURL` exists, we don't
       * create an uneccessary navigation transaction.
       *
       * This was hard to duplicate, but this behavior stopped as soon as this fix was applied. This issue might also
       * only be caused in certain development environments where the usage of a hot module reloader is causing
       * errors.
       */
      if (from === undefined && startingUrl && startingUrl.indexOf(to) !== -1) {
        startingUrl = undefined;
        return;
      }

      if (from !== to) {
        startingUrl = undefined;
        if (activeTransaction) {
          (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.log(`[Tracing] Finishing current transaction with op: ${activeTransaction.op}`);
          // If there's an open transaction on the scope, we need to finish it before creating an new one.
          activeTransaction.finish();
        }
        activeTransaction = customStartTransaction({
          name: global.location.pathname,
          op: 'navigation',
          metadata: { source: 'url' },
        });
      }
    });
  }
}


//# sourceMappingURL=router.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/browser/web-vitals/getCLS.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getCLS": () => (/* binding */ getCLS)
/* harmony export */ });
/* harmony import */ var _lib_bindReporter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/bindReporter.js");
/* harmony import */ var _lib_initMetric_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/initMetric.js");
/* harmony import */ var _lib_observe_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/observe.js");
/* harmony import */ var _lib_onHidden_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/onHidden.js");





/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// https://wicg.github.io/layout-instability/#sec-layout-shift

var getCLS = (onReport, reportAllChanges) => {
  var metric = (0,_lib_initMetric_js__WEBPACK_IMPORTED_MODULE_0__.initMetric)('CLS', 0);
  let report;

  let sessionValue = 0;
  let sessionEntries = [];

  var entryHandler = (entry) => {
    // Only count layout shifts without recent user input.
    // TODO: Figure out why entry can be undefined
    if (entry && !entry.hadRecentInput) {
      var firstSessionEntry = sessionEntries[0];
      var lastSessionEntry = sessionEntries[sessionEntries.length - 1];

      // If the entry occurred less than 1 second after the previous entry and
      // less than 5 seconds after the first entry in the session, include the
      // entry in the current session. Otherwise, start a new session.
      if (
        sessionValue &&
        sessionEntries.length !== 0 &&
        entry.startTime - lastSessionEntry.startTime < 1000 &&
        entry.startTime - firstSessionEntry.startTime < 5000
      ) {
        sessionValue += entry.value;
        sessionEntries.push(entry);
      } else {
        sessionValue = entry.value;
        sessionEntries = [entry];
      }

      // If the current session value is larger than the current CLS value,
      // update CLS and the entries contributing to it.
      if (sessionValue > metric.value) {
        metric.value = sessionValue;
        metric.entries = sessionEntries;
        if (report) {
          report();
        }
      }
    }
  };

  var po = (0,_lib_observe_js__WEBPACK_IMPORTED_MODULE_1__.observe)('layout-shift', entryHandler );
  if (po) {
    report = (0,_lib_bindReporter_js__WEBPACK_IMPORTED_MODULE_2__.bindReporter)(onReport, metric, reportAllChanges);

    (0,_lib_onHidden_js__WEBPACK_IMPORTED_MODULE_3__.onHidden)(() => {
      po.takeRecords().map(entryHandler );
      report(true);
    });
  }
};


//# sourceMappingURL=getCLS.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/browser/web-vitals/getFID.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getFID": () => (/* binding */ getFID)
/* harmony export */ });
/* harmony import */ var _lib_bindReporter_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/bindReporter.js");
/* harmony import */ var _lib_getVisibilityWatcher_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/getVisibilityWatcher.js");
/* harmony import */ var _lib_initMetric_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/initMetric.js");
/* harmony import */ var _lib_observe_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/observe.js");
/* harmony import */ var _lib_onHidden_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/onHidden.js");






/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var getFID = (onReport, reportAllChanges) => {
  var visibilityWatcher = (0,_lib_getVisibilityWatcher_js__WEBPACK_IMPORTED_MODULE_0__.getVisibilityWatcher)();
  var metric = (0,_lib_initMetric_js__WEBPACK_IMPORTED_MODULE_1__.initMetric)('FID');
  let report;

  var entryHandler = (entry) => {
    // Only report if the page wasn't hidden prior to the first input.
    if (report && entry.startTime < visibilityWatcher.firstHiddenTime) {
      metric.value = entry.processingStart - entry.startTime;
      metric.entries.push(entry);
      report(true);
    }
  };

  var po = (0,_lib_observe_js__WEBPACK_IMPORTED_MODULE_2__.observe)('first-input', entryHandler );
  if (po) {
    report = (0,_lib_bindReporter_js__WEBPACK_IMPORTED_MODULE_3__.bindReporter)(onReport, metric, reportAllChanges);
    (0,_lib_onHidden_js__WEBPACK_IMPORTED_MODULE_4__.onHidden)(() => {
      po.takeRecords().map(entryHandler );
      po.disconnect();
    }, true);
  }
};


//# sourceMappingURL=getFID.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/browser/web-vitals/getLCP.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getLCP": () => (/* binding */ getLCP)
/* harmony export */ });
/* harmony import */ var _lib_bindReporter_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/bindReporter.js");
/* harmony import */ var _lib_getVisibilityWatcher_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/getVisibilityWatcher.js");
/* harmony import */ var _lib_initMetric_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/initMetric.js");
/* harmony import */ var _lib_observe_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/observe.js");
/* harmony import */ var _lib_onHidden_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/onHidden.js");






/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// https://wicg.github.io/largest-contentful-paint/#sec-largest-contentful-paint-interface

var reportedMetricIDs = {};

var getLCP = (onReport, reportAllChanges) => {
  var visibilityWatcher = (0,_lib_getVisibilityWatcher_js__WEBPACK_IMPORTED_MODULE_0__.getVisibilityWatcher)();
  var metric = (0,_lib_initMetric_js__WEBPACK_IMPORTED_MODULE_1__.initMetric)('LCP');
  let report;

  var entryHandler = (entry) => {
    // The startTime attribute returns the value of the renderTime if it is not 0,
    // and the value of the loadTime otherwise.
    var value = entry.startTime;

    // If the page was hidden prior to paint time of the entry,
    // ignore it and mark the metric as final, otherwise add the entry.
    if (value < visibilityWatcher.firstHiddenTime) {
      metric.value = value;
      metric.entries.push(entry);
    }

    if (report) {
      report();
    }
  };

  var po = (0,_lib_observe_js__WEBPACK_IMPORTED_MODULE_2__.observe)('largest-contentful-paint', entryHandler);

  if (po) {
    report = (0,_lib_bindReporter_js__WEBPACK_IMPORTED_MODULE_3__.bindReporter)(onReport, metric, reportAllChanges);

    var stopListening = () => {
      if (!reportedMetricIDs[metric.id]) {
        po.takeRecords().map(entryHandler );
        po.disconnect();
        reportedMetricIDs[metric.id] = true;
        report(true);
      }
    };

    // Stop listening after input. Note: while scrolling is an input that
    // stop LCP observation, it's unreliable since it can be programmatically
    // generated. See: https://github.com/GoogleChrome/web-vitals/issues/75
    ['keydown', 'click'].forEach(type => {
      addEventListener(type, stopListening, { once: true, capture: true });
    });

    (0,_lib_onHidden_js__WEBPACK_IMPORTED_MODULE_4__.onHidden)(stopListening, true);
  }
};


//# sourceMappingURL=getLCP.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/bindReporter.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bindReporter": () => (/* binding */ bindReporter)
/* harmony export */ });
var bindReporter = (
  callback,
  metric,
  reportAllChanges,
) => {
  let prevValue;
  return (forceReport) => {
    if (metric.value >= 0) {
      if (forceReport || reportAllChanges) {
        metric.delta = metric.value - (prevValue || 0);

        // Report the metric if there's a non-zero delta or if no previous
        // value exists (which can happen in the case of the document becoming
        // hidden when the metric value is 0).
        // See: https://github.com/GoogleChrome/web-vitals/issues/14
        if (metric.delta || prevValue === undefined) {
          prevValue = metric.value;
          callback(metric);
        }
      }
    }
  };
};


//# sourceMappingURL=bindReporter.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/generateUniqueID.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "generateUniqueID": () => (/* binding */ generateUniqueID)
/* harmony export */ });
/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Performantly generate a unique, 30-char string by combining a version
 * number, the current timestamp with a 13-digit number integer.
 * @return {string}
 */
var generateUniqueID = () => {
  return `v2-${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`;
};


//# sourceMappingURL=generateUniqueID.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/getVisibilityWatcher.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getVisibilityWatcher": () => (/* binding */ getVisibilityWatcher)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/global.js");
/* harmony import */ var _onHidden_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/onHidden.js");



/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

let firstHiddenTime = -1;

var initHiddenTime = () => {
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)().document.visibilityState === 'hidden' ? 0 : Infinity;
};

var trackChanges = () => {
  // Update the time if/when the document becomes hidden.
  (0,_onHidden_js__WEBPACK_IMPORTED_MODULE_1__.onHidden)(({ timeStamp }) => {
    firstHiddenTime = timeStamp;
  }, true);
};

var getVisibilityWatcher = (

) => {
  if (firstHiddenTime < 0) {
    // If the document is hidden when this code runs, assume it was hidden
    // since navigation start. This isn't a perfect heuristic, but it's the
    // best we can do until an API is available to support querying past
    // visibilityState.
    firstHiddenTime = initHiddenTime();
    trackChanges();
  }
  return {
    get firstHiddenTime() {
      return firstHiddenTime;
    },
  };
};


//# sourceMappingURL=getVisibilityWatcher.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/initMetric.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initMetric": () => (/* binding */ initMetric)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/buildPolyfills/_nullishCoalesce.js");
/* harmony import */ var _generateUniqueID_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/generateUniqueID.js");



var initMetric = (name, value) => {
  return {
    name,
    value: (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_0__._nullishCoalesce)(value, () => ( -1)),
    delta: 0,
    entries: [],
    id: (0,_generateUniqueID_js__WEBPACK_IMPORTED_MODULE_1__.generateUniqueID)(),
  };
};


//# sourceMappingURL=initMetric.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/observe.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "observe": () => (/* binding */ observe)
/* harmony export */ });
/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Takes a performance entry type and a callback function, and creates a
 * `PerformanceObserver` instance that will observe the specified entry type
 * with buffering enabled and call the callback _for each entry_.
 *
 * This function also feature-detects entry support and wraps the logic in a
 * try/catch to avoid errors in unsupporting browsers.
 */
var observe = (type, callback) => {
  try {
    if (PerformanceObserver.supportedEntryTypes.includes(type)) {
      // More extensive feature detect needed for Firefox due to:
      // https://github.com/GoogleChrome/web-vitals/issues/142
      if (type === 'first-input' && !('PerformanceEventTiming' in self)) {
        return;
      }

      var po = new PerformanceObserver(l => l.getEntries().map(callback));

      po.observe({ type, buffered: true });
      return po;
    }
  } catch (e) {
    // Do nothing.
  }
  return;
};


//# sourceMappingURL=observe.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/onHidden.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "onHidden": () => (/* binding */ onHidden)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/global.js");


/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var onHidden = (cb, once) => {
  var onHiddenOrPageHide = (event) => {
    if (event.type === 'pagehide' || (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)().document.visibilityState === 'hidden') {
      cb(event);
      if (once) {
        removeEventListener('visibilitychange', onHiddenOrPageHide, true);
        removeEventListener('pagehide', onHiddenOrPageHide, true);
      }
    }
  };
  addEventListener('visibilitychange', onHiddenOrPageHide, true);
  // Some browsers have buggy implementations of visibilitychange,
  // so we use pagehide in addition, just to be safe.
  addEventListener('pagehide', onHiddenOrPageHide, true);
};


//# sourceMappingURL=onHidden.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/errors.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registerErrorInstrumentation": () => (/* binding */ registerErrorInstrumentation)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/instrument.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/esm/utils.js");



/**
 * Configures global error listeners
 */
function registerErrorInstrumentation() {
  (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.addInstrumentationHandler)('error', errorCallback);
  (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.addInstrumentationHandler)('unhandledrejection', errorCallback);
}

/**
 * If an error or unhandled promise occurs, we mark the active transaction as failed
 */
function errorCallback() {
  var activeTransaction = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getActiveTransaction)();
  if (activeTransaction) {
    var status = 'internal_error';
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.log(`[Tracing] Transaction: ${status} -> Global error occured`);
    activeTransaction.setStatus(status);
  }
}


//# sourceMappingURL=errors.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/hubextensions.js":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_addTracingExtensions": () => (/* binding */ _addTracingExtensions),
/* harmony export */   "addExtensionMethods": () => (/* binding */ addExtensionMethods),
/* harmony export */   "startIdleTransaction": () => (/* binding */ startIdleTransaction)
/* harmony export */ });
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/hub/esm/hub.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/is.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/node.js");
/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/@sentry/tracing/esm/errors.js");
/* harmony import */ var _idletransaction_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/tracing/esm/idletransaction.js");
/* harmony import */ var _transaction_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/esm/transaction.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/esm/utils.js");
/* module decorator */ module = __webpack_require__.hmd(module);







/** Returns all trace headers that are currently on the top scope. */
function traceHeaders() {
  var scope = this.getScope();
  if (scope) {
    var span = scope.getSpan();
    if (span) {
      return {
        'sentry-trace': span.toTraceparent(),
      };
    }
  }
  return {};
}

/**
 * Makes a sampling decision for the given transaction and stores it on the transaction.
 *
 * Called every time a transaction is created. Only transactions which emerge with a `sampled` value of `true` will be
 * sent to Sentry.
 *
 * @param transaction: The transaction needing a sampling decision
 * @param options: The current client's options, so we can access `tracesSampleRate` and/or `tracesSampler`
 * @param samplingContext: Default and user-provided data which may be used to help make the decision
 *
 * @returns The given transaction with its `sampled` value set
 */
function sample(
  transaction,
  options,
  samplingContext,
) {
  // nothing to do if tracing is not enabled
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.hasTracingEnabled)(options)) {
    transaction.sampled = false;
    return transaction;
  }

  // if the user has forced a sampling decision by passing a `sampled` value in their transaction context, go with that
  if (transaction.sampled !== undefined) {
    transaction.setMetadata({
      transactionSampling: {
        method: 'explicitly_set',
        rate: Number(transaction.sampled),
      },
    });
    return transaction;
  }

  // we would have bailed already if neither `tracesSampler` nor `tracesSampleRate` were defined, so one of these should
  // work; prefer the hook if so
  let sampleRate;
  if (typeof options.tracesSampler === 'function') {
    sampleRate = options.tracesSampler(samplingContext);
    transaction.setMetadata({
      transactionSampling: {
        method: 'client_sampler',
        // cast to number in case it's a boolean
        rate: Number(sampleRate),
      },
    });
  } else if (samplingContext.parentSampled !== undefined) {
    sampleRate = samplingContext.parentSampled;
    transaction.setMetadata({
      transactionSampling: { method: 'inheritance' },
    });
  } else {
    sampleRate = options.tracesSampleRate;
    transaction.setMetadata({
      transactionSampling: {
        method: 'client_rate',
        // cast to number in case it's a boolean
        rate: Number(sampleRate),
      },
    });
  }

  // Since this is coming from the user (or from a function provided by the user), who knows what we might get. (The
  // only valid values are booleans or numbers between 0 and 1.)
  if (!isValidSampleRate(sampleRate)) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.warn('[Tracing] Discarding transaction because of invalid sample rate.');
    transaction.sampled = false;
    return transaction;
  }

  // if the function returned 0 (or false), or if `tracesSampleRate` is 0, it's a sign the transaction should be dropped
  if (!sampleRate) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
      _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.log(
        `[Tracing] Discarding transaction because ${
          typeof options.tracesSampler === 'function'
            ? 'tracesSampler returned 0 or false'
            : 'a negative sampling decision was inherited or tracesSampleRate is set to 0'
        }`,
      );
    transaction.sampled = false;
    return transaction;
  }

  // Now we roll the dice. Math.random is inclusive of 0, but not of 1, so strict < is safe here. In case sampleRate is
  // a boolean, the < comparison will cause it to be automatically cast to 1 if it's true and 0 if it's false.
  transaction.sampled = Math.random() < (sampleRate );

  // if we're not going to keep it, we're done
  if (!transaction.sampled) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
      _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.log(
        `[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(
          sampleRate,
        )})`,
      );
    return transaction;
  }

  (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.log(`[Tracing] starting ${transaction.op} transaction - ${transaction.name}`);
  return transaction;
}

/**
 * Checks the given sample rate to make sure it is valid type and value (a boolean, or a number between 0 and 1).
 */
function isValidSampleRate(rate) {
  // we need to check NaN explicitly because it's of type 'number' and therefore wouldn't get caught by this typecheck
    if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.isNaN)(rate) || !(typeof rate === 'number' || typeof rate === 'boolean')) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
      _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.warn(
        `[Tracing] Given sample rate is invalid. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(
          rate,
        )} of type ${JSON.stringify(typeof rate)}.`,
      );
    return false;
  }

  // in case sampleRate is a boolean, it will get automatically cast to 1 if it's true and 0 if it's false
  if (rate < 0 || rate > 1) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
      _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.warn(`[Tracing] Given sample rate is invalid. Sample rate must be between 0 and 1. Got ${rate}.`);
    return false;
  }
  return true;
}

/**
 * Creates a new transaction and adds a sampling decision if it doesn't yet have one.
 *
 * The Hub.startTransaction method delegates to this method to do its work, passing the Hub instance in as `this`, as if
 * it had been called on the hub directly. Exists as a separate function so that it can be injected into the class as an
 * "extension method."
 *
 * @param this: The Hub starting the transaction
 * @param transactionContext: Data used to configure the transaction
 * @param CustomSamplingContext: Optional data to be provided to the `tracesSampler` function (if any)
 *
 * @returns The new transaction
 *
 * @see {@link Hub.startTransaction}
 */
function _startTransaction(
  
  transactionContext,
  customSamplingContext,
) {
  var client = this.getClient();
  var options = (client && client.getOptions()) || {};

  let transaction = new _transaction_js__WEBPACK_IMPORTED_MODULE_3__.Transaction(transactionContext, this);
  transaction = sample(transaction, options, {
    parentSampled: transactionContext.parentSampled,
    transactionContext,
    ...customSamplingContext,
  });
  if (transaction.sampled) {
    transaction.initSpanRecorder(options._experiments && (options._experiments.maxSpans ));
  }
  return transaction;
}

/**
 * Create new idle transaction.
 */
function startIdleTransaction(
  hub,
  transactionContext,
  idleTimeout,
  finalTimeout,
  onScope,
  customSamplingContext,
) {
  var client = hub.getClient();
  var options = (client && client.getOptions()) || {};

  let transaction = new _idletransaction_js__WEBPACK_IMPORTED_MODULE_4__.IdleTransaction(transactionContext, hub, idleTimeout, finalTimeout, onScope);
  transaction = sample(transaction, options, {
    parentSampled: transactionContext.parentSampled,
    transactionContext,
    ...customSamplingContext,
  });
  if (transaction.sampled) {
    transaction.initSpanRecorder(options._experiments && (options._experiments.maxSpans ));
  }
  return transaction;
}

/**
 * @private
 */
function _addTracingExtensions() {
  var carrier = (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_5__.getMainCarrier)();
  if (!carrier.__SENTRY__) {
    return;
  }
  carrier.__SENTRY__.extensions = carrier.__SENTRY__.extensions || {};
  if (!carrier.__SENTRY__.extensions.startTransaction) {
    carrier.__SENTRY__.extensions.startTransaction = _startTransaction;
  }
  if (!carrier.__SENTRY__.extensions.traceHeaders) {
    carrier.__SENTRY__.extensions.traceHeaders = traceHeaders;
  }
}

/**
 * @private
 */
function _autoloadDatabaseIntegrations() {
  var carrier = (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_5__.getMainCarrier)();
  if (!carrier.__SENTRY__) {
    return;
  }

  var packageToIntegrationMapping = {
    mongodb() {
      var integration = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.dynamicRequire)(module, './integrations/node/mongo') 

;
      return new integration.Mongo();
    },
    mongoose() {
      var integration = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.dynamicRequire)(module, './integrations/node/mongo') 

;
      return new integration.Mongo({ mongoose: true });
    },
    mysql() {
      var integration = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.dynamicRequire)(module, './integrations/node/mysql') 

;
      return new integration.Mysql();
    },
    pg() {
      var integration = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.dynamicRequire)(module, './integrations/node/postgres') 

;
      return new integration.Postgres();
    },
  };

  var mappedPackages = Object.keys(packageToIntegrationMapping)
    .filter(moduleName => !!(0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.loadModule)(moduleName))
    .map(pkg => {
      try {
        return packageToIntegrationMapping[pkg]();
      } catch (e) {
        return undefined;
      }
    })
    .filter(p => p) ;

  if (mappedPackages.length > 0) {
    carrier.__SENTRY__.integrations = [...(carrier.__SENTRY__.integrations || []), ...mappedPackages];
  }
}

/**
 * This patches the global object and injects the Tracing extensions methods
 */
function addExtensionMethods() {
  _addTracingExtensions();

  // Detect and automatically load specified integrations.
  if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.isNodeEnv)()) {
    _autoloadDatabaseIntegrations();
  }

  // If an error happens globally, we should make sure transaction status is set to error.
  (0,_errors_js__WEBPACK_IMPORTED_MODULE_7__.registerErrorInstrumentation)();
}


//# sourceMappingURL=hubextensions.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/idletransaction.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DEFAULT_FINAL_TIMEOUT": () => (/* binding */ DEFAULT_FINAL_TIMEOUT),
/* harmony export */   "DEFAULT_IDLE_TIMEOUT": () => (/* binding */ DEFAULT_IDLE_TIMEOUT),
/* harmony export */   "HEARTBEAT_INTERVAL": () => (/* binding */ HEARTBEAT_INTERVAL),
/* harmony export */   "IdleTransaction": () => (/* binding */ IdleTransaction),
/* harmony export */   "IdleTransactionSpanRecorder": () => (/* binding */ IdleTransactionSpanRecorder)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/time.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _span_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/esm/span.js");
/* harmony import */ var _transaction_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/esm/transaction.js");




var DEFAULT_IDLE_TIMEOUT = 1000;
var DEFAULT_FINAL_TIMEOUT = 30000;
var HEARTBEAT_INTERVAL = 5000;

/**
 * @inheritDoc
 */
class IdleTransactionSpanRecorder extends _span_js__WEBPACK_IMPORTED_MODULE_0__.SpanRecorder {
   constructor(
      _pushActivity,
      _popActivity,
     transactionSpanId,
    maxlen,
  ) {
    super(maxlen);this._pushActivity = _pushActivity;this._popActivity = _popActivity;this.transactionSpanId = transactionSpanId;;
  }

  /**
   * @inheritDoc
   */
   add(span) {
    // We should make sure we do not push and pop activities for
    // the transaction that this span recorder belongs to.
    if (span.spanId !== this.transactionSpanId) {
      // We patch span.finish() to pop an activity after setting an endTimestamp.
      span.finish = (endTimestamp) => {
        span.endTimestamp = typeof endTimestamp === 'number' ? endTimestamp : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.timestampWithMs)();
        this._popActivity(span.spanId);
      };

      // We should only push new activities if the span does not have an end timestamp.
      if (span.endTimestamp === undefined) {
        this._pushActivity(span.spanId);
      }
    }

    super.add(span);
  }
}

/**
 * An IdleTransaction is a transaction that automatically finishes. It does this by tracking child spans as activities.
 * You can have multiple IdleTransactions active, but if the `onScope` option is specified, the idle transaction will
 * put itself on the scope on creation.
 */
class IdleTransaction extends _transaction_js__WEBPACK_IMPORTED_MODULE_2__.Transaction {
  // Activities store a list of active spans
   __init() {this.activities = {};}

  // Track state of activities in previous heartbeat
  

  // Amount of times heartbeat has counted. Will cause transaction to finish after 3 beats.
   __init2() {this._heartbeatCounter = 0;}

  // We should not use heartbeat if we finished a transaction
   __init3() {this._finished = false;}

    __init4() {this._beforeFinishCallbacks = [];}

  /**
   * Timer that tracks Transaction idleTimeout
   */
  

   constructor(
    transactionContext,
      _idleHub,
    /**
     * The time to wait in ms until the idle transaction will be finished. This timer is started each time
     * there are no active spans on this transaction.
     */
      _idleTimeout = DEFAULT_IDLE_TIMEOUT,
    /**
     * The final value in ms that a transaction cannot exceed
     */
      _finalTimeout = DEFAULT_FINAL_TIMEOUT,
    // Whether or not the transaction should put itself on the scope when it starts and pop itself off when it ends
      _onScope = false,
  ) {
    super(transactionContext, _idleHub);this._idleHub = _idleHub;this._idleTimeout = _idleTimeout;this._finalTimeout = _finalTimeout;this._onScope = _onScope;IdleTransaction.prototype.__init.call(this);IdleTransaction.prototype.__init2.call(this);IdleTransaction.prototype.__init3.call(this);IdleTransaction.prototype.__init4.call(this);;

    if (_onScope) {
      // There should only be one active transaction on the scope
      clearActiveTransaction(_idleHub);

      // We set the transaction here on the scope so error events pick up the trace
      // context and attach it to the error.
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log(`Setting idle transaction on scope. Span ID: ${this.spanId}`);
      _idleHub.configureScope(scope => scope.setSpan(this));
    }

    this._startIdleTimeout();
    setTimeout(() => {
      if (!this._finished) {
        this.setStatus('deadline_exceeded');
        this.finish();
      }
    }, this._finalTimeout);
  }

  /** {@inheritDoc} */
   finish(endTimestamp = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.timestampWithMs)()) {
    this._finished = true;
    this.activities = {};

    if (this.spanRecorder) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
        _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log('[Tracing] finishing IdleTransaction', new Date(endTimestamp * 1000).toISOString(), this.op);

      for (var callback of this._beforeFinishCallbacks) {
        callback(this, endTimestamp);
      }

      this.spanRecorder.spans = this.spanRecorder.spans.filter((span) => {
        // If we are dealing with the transaction itself, we just return it
        if (span.spanId === this.spanId) {
          return true;
        }

        // We cancel all pending spans with status "cancelled" to indicate the idle transaction was finished early
        if (!span.endTimestamp) {
          span.endTimestamp = endTimestamp;
          span.setStatus('cancelled');
          (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
            _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log('[Tracing] cancelling span since transaction ended early', JSON.stringify(span, undefined, 2));
        }

        var keepSpan = span.startTimestamp < endTimestamp;
        if (!keepSpan) {
          (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
            _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log(
              '[Tracing] discarding Span since it happened after Transaction was finished',
              JSON.stringify(span, undefined, 2),
            );
        }
        return keepSpan;
      });

      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log('[Tracing] flushing IdleTransaction');
    } else {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log('[Tracing] No active IdleTransaction');
    }

    // if `this._onScope` is `true`, the transaction put itself on the scope when it started
    if (this._onScope) {
      clearActiveTransaction(this._idleHub);
    }

    return super.finish(endTimestamp);
  }

  /**
   * Register a callback function that gets excecuted before the transaction finishes.
   * Useful for cleanup or if you want to add any additional spans based on current context.
   *
   * This is exposed because users have no other way of running something before an idle transaction
   * finishes.
   */
   registerBeforeFinishCallback(callback) {
    this._beforeFinishCallbacks.push(callback);
  }

  /**
   * @inheritDoc
   */
   initSpanRecorder(maxlen) {
    if (!this.spanRecorder) {
      var pushActivity = (id) => {
        if (this._finished) {
          return;
        }
        this._pushActivity(id);
      };
      var popActivity = (id) => {
        if (this._finished) {
          return;
        }
        this._popActivity(id);
      };

      this.spanRecorder = new IdleTransactionSpanRecorder(pushActivity, popActivity, this.spanId, maxlen);

      // Start heartbeat so that transactions do not run forever.
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log('Starting heartbeat');
      this._pingHeartbeat();
    }
    this.spanRecorder.add(this);
  }

  /**
   * Cancels the existing idletimeout, if there is one
   */
   _cancelIdleTimeout() {
    if (this._idleTimeoutID) {
      clearTimeout(this._idleTimeoutID);
      this._idleTimeoutID = undefined;
    }
  }

  /**
   * Creates an idletimeout
   */
   _startIdleTimeout(endTimestamp) {
    this._cancelIdleTimeout();
    this._idleTimeoutID = setTimeout(() => {
      if (!this._finished && Object.keys(this.activities).length === 0) {
        this.finish(endTimestamp);
      }
    }, this._idleTimeout);
  }

  /**
   * Start tracking a specific activity.
   * @param spanId The span id that represents the activity
   */
   _pushActivity(spanId) {
    this._cancelIdleTimeout();
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log(`[Tracing] pushActivity: ${spanId}`);
    this.activities[spanId] = true;
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log('[Tracing] new activities count', Object.keys(this.activities).length);
  }

  /**
   * Remove an activity from usage
   * @param spanId The span id that represents the activity
   */
   _popActivity(spanId) {
    if (this.activities[spanId]) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log(`[Tracing] popActivity ${spanId}`);
            delete this.activities[spanId];
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log('[Tracing] new activities count', Object.keys(this.activities).length);
    }

    if (Object.keys(this.activities).length === 0) {
      // We need to add the timeout here to have the real endtimestamp of the transaction
      // Remember timestampWithMs is in seconds, timeout is in ms
      var endTimestamp = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.timestampWithMs)() + this._idleTimeout / 1000;
      this._startIdleTimeout(endTimestamp);
    }
  }

  /**
   * Checks when entries of this.activities are not changing for 3 beats.
   * If this occurs we finish the transaction.
   */
   _beat() {
    // We should not be running heartbeat if the idle transaction is finished.
    if (this._finished) {
      return;
    }

    var heartbeatString = Object.keys(this.activities).join('');

    if (heartbeatString === this._prevHeartbeatString) {
      this._heartbeatCounter += 1;
    } else {
      this._heartbeatCounter = 1;
    }

    this._prevHeartbeatString = heartbeatString;

    if (this._heartbeatCounter >= 3) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log('[Tracing] Transaction finished because of no change for 3 heart beats');
      this.setStatus('deadline_exceeded');
      this.finish();
    } else {
      this._pingHeartbeat();
    }
  }

  /**
   * Pings the heartbeat
   */
   _pingHeartbeat() {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log(`pinging Heartbeat -> current counter: ${this._heartbeatCounter}`);
    setTimeout(() => {
      this._beat();
    }, HEARTBEAT_INTERVAL);
  }
}

/**
 * Reset transaction on scope to `undefined`
 */
function clearActiveTransaction(hub) {
  var scope = hub.getScope();
  if (scope) {
    var transaction = scope.getTransaction();
    if (transaction) {
      scope.setSpan(undefined);
    }
  }
}


//# sourceMappingURL=idletransaction.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/index.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BROWSER_TRACING_INTEGRATION_ID": () => (/* reexport safe */ _browser_browsertracing_js__WEBPACK_IMPORTED_MODULE_7__.BROWSER_TRACING_INTEGRATION_ID),
/* harmony export */   "BrowserTracing": () => (/* reexport safe */ _browser_browsertracing_js__WEBPACK_IMPORTED_MODULE_7__.BrowserTracing),
/* harmony export */   "IdleTransaction": () => (/* reexport safe */ _idletransaction_js__WEBPACK_IMPORTED_MODULE_5__.IdleTransaction),
/* harmony export */   "Integrations": () => (/* reexport module object */ _integrations_index_js__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   "Span": () => (/* reexport safe */ _span_js__WEBPACK_IMPORTED_MODULE_2__.Span),
/* harmony export */   "SpanStatus": () => (/* reexport safe */ _spanstatus_js__WEBPACK_IMPORTED_MODULE_3__.SpanStatus),
/* harmony export */   "TRACEPARENT_REGEXP": () => (/* reexport safe */ _sentry_utils__WEBPACK_IMPORTED_MODULE_9__.TRACEPARENT_REGEXP),
/* harmony export */   "Transaction": () => (/* reexport safe */ _transaction_js__WEBPACK_IMPORTED_MODULE_4__.Transaction),
/* harmony export */   "addExtensionMethods": () => (/* reexport safe */ _hubextensions_js__WEBPACK_IMPORTED_MODULE_0__.addExtensionMethods),
/* harmony export */   "defaultRequestInstrumentationOptions": () => (/* reexport safe */ _browser_request_js__WEBPACK_IMPORTED_MODULE_8__.defaultRequestInstrumentationOptions),
/* harmony export */   "extractTraceparentData": () => (/* reexport safe */ _sentry_utils__WEBPACK_IMPORTED_MODULE_9__.extractTraceparentData),
/* harmony export */   "getActiveTransaction": () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_6__.getActiveTransaction),
/* harmony export */   "hasTracingEnabled": () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_6__.hasTracingEnabled),
/* harmony export */   "instrumentOutgoingRequests": () => (/* reexport safe */ _browser_request_js__WEBPACK_IMPORTED_MODULE_8__.instrumentOutgoingRequests),
/* harmony export */   "spanStatusfromHttpCode": () => (/* reexport safe */ _span_js__WEBPACK_IMPORTED_MODULE_2__.spanStatusfromHttpCode),
/* harmony export */   "startIdleTransaction": () => (/* reexport safe */ _hubextensions_js__WEBPACK_IMPORTED_MODULE_0__.startIdleTransaction),
/* harmony export */   "stripUrlQueryAndFragment": () => (/* reexport safe */ _sentry_utils__WEBPACK_IMPORTED_MODULE_10__.stripUrlQueryAndFragment)
/* harmony export */ });
/* harmony import */ var _hubextensions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/esm/hubextensions.js");
/* harmony import */ var _integrations_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/esm/integrations/index.js");
/* harmony import */ var _span_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/esm/span.js");
/* harmony import */ var _spanstatus_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/esm/spanstatus.js");
/* harmony import */ var _transaction_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/tracing/esm/transaction.js");
/* harmony import */ var _idletransaction_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/tracing/esm/idletransaction.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@sentry/tracing/esm/utils.js");
/* harmony import */ var _browser_browsertracing_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/browsertracing.js");
/* harmony import */ var _browser_request_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/request.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/tracing.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/url.js");














;
;

// Treeshakable guard to remove all code related to tracing

// Guard for tree
if (typeof __SENTRY_TRACING__ === 'undefined' || __SENTRY_TRACING__) {
  // We are patching the global object with our hub extension methods
  (0,_hubextensions_js__WEBPACK_IMPORTED_MODULE_0__.addExtensionMethods)();
}
//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/integrations/index.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Apollo": () => (/* reexport safe */ _node_apollo_js__WEBPACK_IMPORTED_MODULE_6__.Apollo),
/* harmony export */   "BrowserTracing": () => (/* reexport safe */ _browser_browsertracing_js__WEBPACK_IMPORTED_MODULE_7__.BrowserTracing),
/* harmony export */   "Express": () => (/* reexport safe */ _node_express_js__WEBPACK_IMPORTED_MODULE_0__.Express),
/* harmony export */   "GraphQL": () => (/* reexport safe */ _node_graphql_js__WEBPACK_IMPORTED_MODULE_5__.GraphQL),
/* harmony export */   "Mongo": () => (/* reexport safe */ _node_mongo_js__WEBPACK_IMPORTED_MODULE_3__.Mongo),
/* harmony export */   "Mysql": () => (/* reexport safe */ _node_mysql_js__WEBPACK_IMPORTED_MODULE_2__.Mysql),
/* harmony export */   "Postgres": () => (/* reexport safe */ _node_postgres_js__WEBPACK_IMPORTED_MODULE_1__.Postgres),
/* harmony export */   "Prisma": () => (/* reexport safe */ _node_prisma_js__WEBPACK_IMPORTED_MODULE_4__.Prisma)
/* harmony export */ });
/* harmony import */ var _node_express_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/esm/integrations/node/express.js");
/* harmony import */ var _node_postgres_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/esm/integrations/node/postgres.js");
/* harmony import */ var _node_mysql_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/esm/integrations/node/mysql.js");
/* harmony import */ var _node_mongo_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/esm/integrations/node/mongo.js");
/* harmony import */ var _node_prisma_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/tracing/esm/integrations/node/prisma.js");
/* harmony import */ var _node_graphql_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/tracing/esm/integrations/node/graphql.js");
/* harmony import */ var _node_apollo_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@sentry/tracing/esm/integrations/node/apollo.js");
/* harmony import */ var _browser_browsertracing_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./node_modules/@sentry/tracing/esm/browser/browsertracing.js");









//# sourceMappingURL=index.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/integrations/node/apollo.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Apollo": () => (/* binding */ Apollo)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/node.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/object.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/misc.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/is.js");



/** Tracing integration for Apollo */
class Apollo  {constructor() { Apollo.prototype.__init.call(this); }
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'Apollo';}

  /**
   * @inheritDoc
   */
   __init() {this.name = Apollo.id;}

  /**
   * @inheritDoc
   */
   setupOnce(_, getCurrentHub) {
    var pkg = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.loadModule)

('apollo-server-core');

    if (!pkg) {
      _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.error('Apollo Integration was unable to require apollo-server-core package.');
      return;
    }

    /**
     * Iterate over resolvers of the ApolloServer instance before schemas are constructed.
     */
    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.fill)(pkg.ApolloServerBase.prototype, 'constructSchema', function (orig) {
      return function () {
        var resolvers = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.arrayify)(this.config.resolvers);

        this.config.resolvers = resolvers.map(model => {
          Object.keys(model).forEach(resolverGroupName => {
            Object.keys(model[resolverGroupName]).forEach(resolverName => {
              if (typeof model[resolverGroupName][resolverName] !== 'function') {
                return;
              }

              wrapResolver(model, resolverGroupName, resolverName, getCurrentHub);
            });
          });

          return model;
        });

        return orig.call(this);
      };
    });
  }
}Apollo.__initStatic();

/**
 * Wrap a single resolver which can be a parent of other resolvers and/or db operations.
 */
function wrapResolver(
  model,
  resolverGroupName,
  resolverName,
  getCurrentHub,
) {
  (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.fill)(model[resolverGroupName], resolverName, function (orig) {
    return function ( ...args) {
      var scope = getCurrentHub().getScope();
      var parentSpan = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._optionalChain)([scope, 'optionalAccess', _2 => _2.getSpan, 'call', _3 => _3()]);
      var span = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._optionalChain)([parentSpan, 'optionalAccess', _4 => _4.startChild, 'call', _5 => _5({
        description: `${resolverGroupName}.${resolverName}`,
        op: 'db.graphql.apollo',
      })]);

      var rv = orig.call(this, ...args);

      if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.isThenable)(rv)) {
        return rv.then((res) => {
          (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._optionalChain)([span, 'optionalAccess', _6 => _6.finish, 'call', _7 => _7()]);
          return res;
        });
      }

      (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._optionalChain)([span, 'optionalAccess', _8 => _8.finish, 'call', _9 => _9()]);

      return rv;
    };
  });
}


//# sourceMappingURL=apollo.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/integrations/node/express.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Express": () => (/* binding */ Express)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/url.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/requestdata.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/is.js");



/**
 * Express integration
 *
 * Provides an request and error handler for Express framework as well as tracing capabilities
 */
class Express  {
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'Express';}

  /**
   * @inheritDoc
   */
   __init() {this.name = Express.id;}

  /**
   * Express App instance
   */
  
  

  /**
   * @inheritDoc
   */
   constructor(options = {}) {;Express.prototype.__init.call(this);
    this._router = options.router || options.app;
    this._methods = (Array.isArray(options.methods) ? options.methods : []).concat('use');
  }

  /**
   * @inheritDoc
   */
   setupOnce() {
    if (!this._router) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.logger.error('ExpressIntegration is missing an Express instance');
      return;
    }
    instrumentMiddlewares(this._router, this._methods);
    instrumentRouter(this._router );
  }
}Express.__initStatic();

/**
 * Wraps original middleware function in a tracing call, which stores the info about the call as a span,
 * and finishes it once the middleware is done invoking.
 *
 * Express middlewares have 3 various forms, thus we have to take care of all of them:
 * // sync
 * app.use(function (req, res) { ... })
 * // async
 * app.use(function (req, res, next) { ... })
 * // error handler
 * app.use(function (err, req, res, next) { ... })
 *
 * They all internally delegate to the `router[method]` of the given application instance.
 */
function wrap(fn, method) {
  var arity = fn.length;

  switch (arity) {
    case 2: {
      return function ( req, res) {
        var transaction = res.__sentry_transaction;
        if (transaction) {
          var span = transaction.startChild({
            description: fn.name,
            op: `express.middleware.${method}`,
          });
          res.once('finish', () => {
            span.finish();
          });
        }
        return fn.call(this, req, res);
      };
    }
    case 3: {
      return function (
        
        req,
        res,
        next,
      ) {
        var transaction = res.__sentry_transaction;
        var span = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_1__._optionalChain)([transaction, 'optionalAccess', _ => _.startChild, 'call', _2 => _2({
          description: fn.name,
          op: `express.middleware.${method}`,
        })]);
        fn.call(this, req, res, function ( ...args) {
          (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_1__._optionalChain)([span, 'optionalAccess', _3 => _3.finish, 'call', _4 => _4()]);
          next.call(this, ...args);
        });
      };
    }
    case 4: {
      return function (
        
        err,
        req,
        res,
        next,
      ) {
        var transaction = res.__sentry_transaction;
        var span = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_1__._optionalChain)([transaction, 'optionalAccess', _5 => _5.startChild, 'call', _6 => _6({
          description: fn.name,
          op: `express.middleware.${method}`,
        })]);
        fn.call(this, err, req, res, function ( ...args) {
          (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_1__._optionalChain)([span, 'optionalAccess', _7 => _7.finish, 'call', _8 => _8()]);
          next.call(this, ...args);
        });
      };
    }
    default: {
      throw new Error(`Express middleware takes 2-4 arguments. Got: ${arity}`);
    }
  }
}

/**
 * Takes all the function arguments passed to the original `app` or `router` method, eg. `app.use` or `router.use`
 * and wraps every function, as well as array of functions with a call to our `wrap` method.
 * We have to take care of the arrays as well as iterate over all of the arguments,
 * as `app.use` can accept middlewares in few various forms.
 *
 * app.use([<path>], <fn>)
 * app.use([<path>], <fn>, ...<fn>)
 * app.use([<path>], ...<fn>[])
 */
function wrapMiddlewareArgs(args, method) {
  return args.map((arg) => {
    if (typeof arg === 'function') {
      return wrap(arg, method);
    }

    if (Array.isArray(arg)) {
      return arg.map((a) => {
        if (typeof a === 'function') {
          return wrap(a, method);
        }
        return a;
      });
    }

    return arg;
  });
}

/**
 * Patches original router to utilize our tracing functionality
 */
function patchMiddleware(router, method) {
  var originalCallback = router[method];

  router[method] = function (...args) {
    return originalCallback.call(this, ...wrapMiddlewareArgs(args, method));
  };

  return router;
}

/**
 * Patches original router methods
 */
function instrumentMiddlewares(router, methods = []) {
  methods.forEach((method) => patchMiddleware(router, method));
}

/**
 * Patches the prototype of Express.Router to accumulate the resolved route
 * if a layer instance's `match` function was called and it returned a successful match.
 *
 * @see https://github.com/expressjs/express/blob/master/lib/router/index.js
 *
 * @param appOrRouter the router instance which can either be an app (i.e. top-level) or a (nested) router.
 */
function instrumentRouter(appOrRouter) {
  // This is how we can distinguish between app and routers
  var isApp = 'settings' in appOrRouter;

  // In case the app's top-level router hasn't been initialized yet, we have to do it now
  if (isApp && appOrRouter._router === undefined && appOrRouter.lazyrouter) {
    appOrRouter.lazyrouter();
  }

  var router = isApp ? appOrRouter._router : appOrRouter;

  if (!router) {
    /*
    If we end up here, this means likely that this integration is used with Express 3 or Express 5.
    For now, we don't support these versions (3 is very old and 5 is still in beta). To support Express 5,
    we'd need to make more changes to the routing instrumentation because the router is no longer part of
    the Express core package but maintained in its own package. The new router has different function
    signatures and works slightly differently, demanding more changes than just taking the router from
    `app.router` instead of `app._router`.
    @see https://github.com/pillarjs/router

    TODO: Proper Express 5 support
    */
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.logger.debug('Cannot instrument router for URL Parameterization (did not find a valid router).');
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.logger.debug('Routing instrumentation is currently only supported in Express 4.');
    return;
  }

  var routerProto = Object.getPrototypeOf(router) ;

  var originalProcessParams = routerProto.process_params;
  routerProto.process_params = function process_params(
    layer,
    called,
    req,
    res,
    done,
  ) {
    // Base case: We're in the first part of the URL (thus we start with the root '/')
    if (!req._reconstructedRoute) {
      req._reconstructedRoute = '';
    }

    // If the layer's partial route has params, is a regex or an array, the route is stored in layer.route.
    const { layerRoutePath, isRegex, isArray, numExtraSegments } = getLayerRoutePathInfo(layer);

    // Otherwise, the hardcoded path (i.e. a partial route without params) is stored in layer.path
    var partialRoute = layerRoutePath || layer.path || '';

    // Normalize the partial route so that it doesn't contain leading or trailing slashes
    // and exclude empty or '*' wildcard routes.
    // The exclusion of '*' routes is our best effort to not "pollute" the transaction name
    // with interim handlers (e.g. ones that check authentication or do other middleware stuff).
    // We want to end up with the parameterized URL of the incoming request without any extraneous path segments.
    var finalPartialRoute = partialRoute
      .split('/')
      .filter(segment => segment.length > 0 && (isRegex || isArray || !segment.includes('*')))
      .join('/');

    // If we found a valid partial URL, we append it to the reconstructed route
    if (finalPartialRoute && finalPartialRoute.length > 0) {
      // If the partial route is from a regex route, we append a '/' to close the regex
      req._reconstructedRoute += `/${finalPartialRoute}${isRegex ? '/' : ''}`;
    }

    // Now we check if we are in the "last" part of the route. We determine this by comparing the
    // number of URL segments from the original URL to that of our reconstructed parameterized URL.
    // If we've reached our final destination, we update the transaction name.
    var urlLength = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.getNumberOfUrlSegments)(req.originalUrl || '') + numExtraSegments;
    var routeLength = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.getNumberOfUrlSegments)(req._reconstructedRoute);

    if (urlLength === routeLength) {
      var transaction = res.__sentry_transaction;
      if (transaction && transaction.metadata.source !== 'custom') {
        // If the request URL is '/' or empty, the reconstructed route will be empty.
        // Therefore, we fall back to setting the final route to '/' in this case.
        var finalRoute = req._reconstructedRoute || '/';

        transaction.setName(...(0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.extractPathForTransaction)(req, { path: true, method: true, customRoute: finalRoute }));
      }
    }

    return originalProcessParams.call(this, layer, called, req, res, done);
  };
}

/**
 * Extracts and stringifies the layer's route which can either be a string with parameters (`users/:id`),
 * a RegEx (`/test/`) or an array of strings and regexes (`['/path1', /\/path[2-5]/, /path/:id]`). Additionally
 * returns extra information about the route, such as if the route is defined as regex or as an array.
 *
 * @param layer the layer to extract the stringified route from
 *
 * @returns an object containing the stringified route, a flag determining if the route was a regex
 *          and the number of extra segments to the matched path that are additionally in the route,
 *          if the route was an array (defaults to 0).
 */
function getLayerRoutePathInfo(layer) {
  var lrp = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_1__._optionalChain)([layer, 'access', _9 => _9.route, 'optionalAccess', _10 => _10.path]);

  var isRegex = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.isRegExp)(lrp);
  var isArray = Array.isArray(lrp);

  if (!lrp) {
    return { isRegex, isArray, numExtraSegments: 0 };
  }

  var numExtraSegments = isArray
    ? Math.max(getNumberOfArrayUrlSegments(lrp ) - (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.getNumberOfUrlSegments)(layer.path || ''), 0)
    : 0;

  var layerRoutePath = getLayerRoutePathString(isArray, lrp);

  return { layerRoutePath, isRegex, isArray, numExtraSegments };
}

/**
 * Returns the number of URL segments in an array of routes
 *
 * Example: ['/api/test', /\/api\/post[0-9]/, '/users/:id/details`] -> 7
 */
function getNumberOfArrayUrlSegments(routesArray) {
  return routesArray.reduce((accNumSegments, currentRoute) => {
    // array members can be a RegEx -> convert them toString
    return accNumSegments + (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.getNumberOfUrlSegments)(currentRoute.toString());
  }, 0);
}

/**
 * Extracts and returns the stringified version of the layers route path
 * Handles route arrays (by joining the paths together) as well as RegExp and normal
 * string values (in the latter case the toString conversion is technically unnecessary but
 * it doesn't hurt us either).
 */
function getLayerRoutePathString(isArray, lrp) {
  if (isArray) {
    return (lrp ).map(r => r.toString()).join(',');
  }
  return lrp && lrp.toString();
}


//# sourceMappingURL=express.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/integrations/node/graphql.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GraphQL": () => (/* binding */ GraphQL)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/node.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/object.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/is.js");



/** Tracing integration for graphql package */
class GraphQL  {constructor() { GraphQL.prototype.__init.call(this); }
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'GraphQL';}

  /**
   * @inheritDoc
   */
   __init() {this.name = GraphQL.id;}

  /**
   * @inheritDoc
   */
   setupOnce(_, getCurrentHub) {
    var pkg = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.loadModule)

('graphql/execution/execute.js');

    if (!pkg) {
      _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.error('GraphQL Integration was unable to require graphql/execution package.');
      return;
    }

    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.fill)(pkg, 'execute', function (orig) {
      return function ( ...args) {
        var scope = getCurrentHub().getScope();
        var parentSpan = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([scope, 'optionalAccess', _2 => _2.getSpan, 'call', _3 => _3()]);

        var span = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([parentSpan, 'optionalAccess', _4 => _4.startChild, 'call', _5 => _5({
          description: 'execute',
          op: 'db.graphql',
        })]);

        (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([scope, 'optionalAccess', _6 => _6.setSpan, 'call', _7 => _7(span)]);

        var rv = orig.call(this, ...args);

        if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.isThenable)(rv)) {
          return rv.then((res) => {
            (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([span, 'optionalAccess', _8 => _8.finish, 'call', _9 => _9()]);
            (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([scope, 'optionalAccess', _10 => _10.setSpan, 'call', _11 => _11(parentSpan)]);

            return res;
          });
        }

        (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([span, 'optionalAccess', _12 => _12.finish, 'call', _13 => _13()]);
        (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([scope, 'optionalAccess', _14 => _14.setSpan, 'call', _15 => _15(parentSpan)]);
        return rv;
      };
    });
  }
}GraphQL.__initStatic();


//# sourceMappingURL=graphql.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/integrations/node/mongo.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Mongo": () => (/* binding */ Mongo)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/node.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/object.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/is.js");



// This allows us to use the same array for both defaults options and the type itself.
// (note `as const` at the end to make it a union of string literal types (i.e. "a" | "b" | ... )
// and not just a string[])

var OPERATIONS = [
  'aggregate', // aggregate(pipeline, options, callback)
  'bulkWrite', // bulkWrite(operations, options, callback)
  'countDocuments', // countDocuments(query, options, callback)
  'createIndex', // createIndex(fieldOrSpec, options, callback)
  'createIndexes', // createIndexes(indexSpecs, options, callback)
  'deleteMany', // deleteMany(filter, options, callback)
  'deleteOne', // deleteOne(filter, options, callback)
  'distinct', // distinct(key, query, options, callback)
  'drop', // drop(options, callback)
  'dropIndex', // dropIndex(indexName, options, callback)
  'dropIndexes', // dropIndexes(options, callback)
  'estimatedDocumentCount', // estimatedDocumentCount(options, callback)
  'find', // find(query, options, callback)
  'findOne', // findOne(query, options, callback)
  'findOneAndDelete', // findOneAndDelete(filter, options, callback)
  'findOneAndReplace', // findOneAndReplace(filter, replacement, options, callback)
  'findOneAndUpdate', // findOneAndUpdate(filter, update, options, callback)
  'indexes', // indexes(options, callback)
  'indexExists', // indexExists(indexes, options, callback)
  'indexInformation', // indexInformation(options, callback)
  'initializeOrderedBulkOp', // initializeOrderedBulkOp(options, callback)
  'insertMany', // insertMany(docs, options, callback)
  'insertOne', // insertOne(doc, options, callback)
  'isCapped', // isCapped(options, callback)
  'mapReduce', // mapReduce(map, reduce, options, callback)
  'options', // options(options, callback)
  'parallelCollectionScan', // parallelCollectionScan(options, callback)
  'rename', // rename(newName, options, callback)
  'replaceOne', // replaceOne(filter, doc, options, callback)
  'stats', // stats(options, callback)
  'updateMany', // updateMany(filter, update, options, callback)
  'updateOne', // updateOne(filter, update, options, callback)
] ;

// All of the operations above take `options` and `callback` as their final parameters, but some of them
// take additional parameters as well. For those operations, this is a map of
// { <operation name>:  [<names of additional parameters>] }, as a way to know what to call the operation's
// positional arguments when we add them to the span's `data` object later
var OPERATION_SIGNATURES

 = {
  // aggregate intentionally not included because `pipeline` arguments are too complex to serialize well
  // see https://github.com/getsentry/sentry-javascript/pull/3102
  bulkWrite: ['operations'],
  countDocuments: ['query'],
  createIndex: ['fieldOrSpec'],
  createIndexes: ['indexSpecs'],
  deleteMany: ['filter'],
  deleteOne: ['filter'],
  distinct: ['key', 'query'],
  dropIndex: ['indexName'],
  find: ['query'],
  findOne: ['query'],
  findOneAndDelete: ['filter'],
  findOneAndReplace: ['filter', 'replacement'],
  findOneAndUpdate: ['filter', 'update'],
  indexExists: ['indexes'],
  insertMany: ['docs'],
  insertOne: ['doc'],
  mapReduce: ['map', 'reduce'],
  rename: ['newName'],
  replaceOne: ['filter', 'doc'],
  updateMany: ['filter', 'update'],
  updateOne: ['filter', 'update'],
};

/** Tracing integration for mongo package */
class Mongo  {
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'Mongo';}

  /**
   * @inheritDoc
   */
   __init() {this.name = Mongo.id;}

  /**
   * @inheritDoc
   */
   constructor(options = {}) {;Mongo.prototype.__init.call(this);
    this._operations = Array.isArray(options.operations) ? options.operations : (OPERATIONS );
    this._describeOperations = 'describeOperations' in options ? options.describeOperations : true;
    this._useMongoose = !!options.useMongoose;
  }

  /**
   * @inheritDoc
   */
   setupOnce(_, getCurrentHub) {
    var moduleName = this._useMongoose ? 'mongoose' : 'mongodb';
    var pkg = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.loadModule)(moduleName);

    if (!pkg) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.error(`Mongo Integration was unable to require \`${moduleName}\` package.`);
      return;
    }

    this._instrumentOperations(pkg.Collection, this._operations, getCurrentHub);
  }

  /**
   * Patches original collection methods
   */
   _instrumentOperations(collection, operations, getCurrentHub) {
    operations.forEach((operation) => this._patchOperation(collection, operation, getCurrentHub));
  }

  /**
   * Patches original collection to utilize our tracing functionality
   */
   _patchOperation(collection, operation, getCurrentHub) {
    if (!(operation in collection.prototype)) return;

    var getSpanContext = this._getSpanContextFromOperationArguments.bind(this);

    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.fill)(collection.prototype, operation, function (orig) {
      return function ( ...args) {
        var lastArg = args[args.length - 1];
        var scope = getCurrentHub().getScope();
        var parentSpan = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([scope, 'optionalAccess', _2 => _2.getSpan, 'call', _3 => _3()]);

        // Check if the operation was passed a callback. (mapReduce requires a different check, as
        // its (non-callback) arguments can also be functions.)
        if (typeof lastArg !== 'function' || (operation === 'mapReduce' && args.length === 2)) {
          var span = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([parentSpan, 'optionalAccess', _4 => _4.startChild, 'call', _5 => _5(getSpanContext(this, operation, args))]);
          var maybePromise = orig.call(this, ...args) ;

          if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.isThenable)(maybePromise)) {
            return maybePromise.then((res) => {
              (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([span, 'optionalAccess', _6 => _6.finish, 'call', _7 => _7()]);
              return res;
            });
          } else {
            (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([span, 'optionalAccess', _8 => _8.finish, 'call', _9 => _9()]);
            return maybePromise;
          }
        }

        var span = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([parentSpan, 'optionalAccess', _10 => _10.startChild, 'call', _11 => _11(getSpanContext(this, operation, args.slice(0, -1)))]);
        return orig.call(this, ...args.slice(0, -1), function (err, result) {
          (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([span, 'optionalAccess', _12 => _12.finish, 'call', _13 => _13()]);
          lastArg(err, result);
        });
      };
    });
  }

  /**
   * Form a SpanContext based on the user input to a given operation.
   */
   _getSpanContextFromOperationArguments(
    collection,
    operation,
    args,
  ) {
    var data = {
      collectionName: collection.collectionName,
      dbName: collection.dbName,
      namespace: collection.namespace,
    };
    var spanContext = {
      op: 'db',
      description: operation,
      data,
    };

    // If the operation takes no arguments besides `options` and `callback`, or if argument
    // collection is disabled for this operation, just return early.
    var signature = OPERATION_SIGNATURES[operation];
    var shouldDescribe = Array.isArray(this._describeOperations)
      ? this._describeOperations.includes(operation)
      : this._describeOperations;

    if (!signature || !shouldDescribe) {
      return spanContext;
    }

    try {
      // Special case for `mapReduce`, as the only one accepting functions as arguments.
      if (operation === 'mapReduce') {
        const [map, reduce] = args ;
        data[signature[0]] = typeof map === 'string' ? map : map.name || '<anonymous>';
        data[signature[1]] = typeof reduce === 'string' ? reduce : reduce.name || '<anonymous>';
      } else {
        for (let i = 0; i < signature.length; i++) {
          data[signature[i]] = JSON.stringify(args[i]);
        }
      }
    } catch (_oO) {
      // no-empty
    }

    return spanContext;
  }
}Mongo.__initStatic();


//# sourceMappingURL=mongo.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/integrations/node/mysql.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Mysql": () => (/* binding */ Mysql)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/node.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/object.js");



/** Tracing integration for node-mysql package */
class Mysql  {constructor() { Mysql.prototype.__init.call(this); }
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'Mysql';}

  /**
   * @inheritDoc
   */
   __init() {this.name = Mysql.id;}

  /**
   * @inheritDoc
   */
   setupOnce(_, getCurrentHub) {
    var pkg = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.loadModule)('mysql/lib/Connection.js');

    if (!pkg) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.error('Mysql Integration was unable to require `mysql` package.');
      return;
    }

    // The original function will have one of these signatures:
    //    function (callback) => void
    //    function (options, callback) => void
    //    function (options, values, callback) => void
    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.fill)(pkg, 'createQuery', function (orig) {
      return function ( options, values, callback) {
        var scope = getCurrentHub().getScope();
        var parentSpan = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([scope, 'optionalAccess', _2 => _2.getSpan, 'call', _3 => _3()]);
        var span = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([parentSpan, 'optionalAccess', _4 => _4.startChild, 'call', _5 => _5({
          description: typeof options === 'string' ? options : (options ).sql,
          op: 'db',
        })]);

        if (typeof callback === 'function') {
          return orig.call(this, options, values, function (err, result, fields) {
            (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([span, 'optionalAccess', _6 => _6.finish, 'call', _7 => _7()]);
            callback(err, result, fields);
          });
        }

        if (typeof values === 'function') {
          return orig.call(this, options, function (err, result, fields) {
            (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([span, 'optionalAccess', _8 => _8.finish, 'call', _9 => _9()]);
            values(err, result, fields);
          });
        }

        return orig.call(this, options, values, callback);
      };
    });
  }
}Mysql.__initStatic();


//# sourceMappingURL=mysql.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/integrations/node/postgres.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Postgres": () => (/* binding */ Postgres)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/node.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/object.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/is.js");



/** Tracing integration for node-postgres package */
class Postgres  {
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'Postgres';}

  /**
   * @inheritDoc
   */
   __init() {this.name = Postgres.id;}

   constructor(options = {}) {;Postgres.prototype.__init.call(this);
    this._usePgNative = !!options.usePgNative;
  }

  /**
   * @inheritDoc
   */
   setupOnce(_, getCurrentHub) {
    var pkg = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.loadModule)('pg');

    if (!pkg) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.error('Postgres Integration was unable to require `pg` package.');
      return;
    }

    if (this._usePgNative && !(0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([pkg, 'access', _2 => _2.native, 'optionalAccess', _3 => _3.Client])) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.error("Postgres Integration was unable to access 'pg-native' bindings.");
      return;
    }

    const { Client } = this._usePgNative ? pkg.native : pkg;

    /**
     * function (query, callback) => void
     * function (query, params, callback) => void
     * function (query) => Promise
     * function (query, params) => Promise
     * function (pg.Cursor) => pg.Cursor
     */
    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.fill)(Client.prototype, 'query', function (orig) {
      return function ( config, values, callback) {
        var scope = getCurrentHub().getScope();
        var parentSpan = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([scope, 'optionalAccess', _4 => _4.getSpan, 'call', _5 => _5()]);
        var span = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([parentSpan, 'optionalAccess', _6 => _6.startChild, 'call', _7 => _7({
          description: typeof config === 'string' ? config : (config ).text,
          op: 'db',
        })]);

        if (typeof callback === 'function') {
          return orig.call(this, config, values, function (err, result) {
            (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([span, 'optionalAccess', _8 => _8.finish, 'call', _9 => _9()]);
            callback(err, result);
          });
        }

        if (typeof values === 'function') {
          return orig.call(this, config, function (err, result) {
            (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([span, 'optionalAccess', _10 => _10.finish, 'call', _11 => _11()]);
            values(err, result);
          });
        }

        var rv = typeof values !== 'undefined' ? orig.call(this, config, values) : orig.call(this, config);

        if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.isThenable)(rv)) {
          return rv.then((res) => {
            (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([span, 'optionalAccess', _12 => _12.finish, 'call', _13 => _13()]);
            return res;
          });
        }

        (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([span, 'optionalAccess', _14 => _14.finish, 'call', _15 => _15()]);
        return rv;
      };
    });
  }
}Postgres.__initStatic();


//# sourceMappingURL=postgres.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/integrations/node/prisma.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Prisma": () => (/* binding */ Prisma)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/is.js");



function isValidPrismaClient(possibleClient) {
  return possibleClient && !!(possibleClient )['$use'];
}

/** Tracing integration for @prisma/client package */
class Prisma  {
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'Prisma';}

  /**
   * @inheritDoc
   */
   __init() {this.name = Prisma.id;}

  /**
   * Prisma ORM Client Instance
   */
  

  /**
   * @inheritDoc
   */
   constructor(options = {}) {;Prisma.prototype.__init.call(this);
    if (isValidPrismaClient(options.client)) {
      this._client = options.client;
    } else {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
        _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.logger.warn(
          `Unsupported Prisma client provided to PrismaIntegration. Provided client: ${JSON.stringify(options.client)}`,
        );
    }
  }

  /**
   * @inheritDoc
   */
   setupOnce(_, getCurrentHub) {
    if (!this._client) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.logger.error('PrismaIntegration is missing a Prisma Client Instance');
      return;
    }

    this._client.$use((params, next) => {
      var scope = getCurrentHub().getScope();
      var parentSpan = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_1__._optionalChain)([scope, 'optionalAccess', _2 => _2.getSpan, 'call', _3 => _3()]);

      var action = params.action;
      var model = params.model;

      var span = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_1__._optionalChain)([parentSpan, 'optionalAccess', _4 => _4.startChild, 'call', _5 => _5({
        description: model ? `${model} ${action}` : action,
        op: 'db.prisma',
      })]);

      var rv = next(params);

      if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.isThenable)(rv)) {
        return rv.then((res) => {
          (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_1__._optionalChain)([span, 'optionalAccess', _6 => _6.finish, 'call', _7 => _7()]);
          return res;
        });
      }

      (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_1__._optionalChain)([span, 'optionalAccess', _8 => _8.finish, 'call', _9 => _9()]);
      return rv;
    });
  }
}Prisma.__initStatic();


//# sourceMappingURL=prisma.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/span.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Span": () => (/* binding */ Span),
/* harmony export */   "SpanRecorder": () => (/* binding */ SpanRecorder),
/* harmony export */   "spanStatusfromHttpCode": () => (/* binding */ spanStatusfromHttpCode)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/buildPolyfills/_nullishCoalesce.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/misc.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/time.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/object.js");



/**
 * Keeps track of finished spans for a given transaction
 * @internal
 * @hideconstructor
 * @hidden
 */
class SpanRecorder {
   __init() {this.spans = [];}

   constructor(maxlen = 1000) {;SpanRecorder.prototype.__init.call(this);
    this._maxlen = maxlen;
  }

  /**
   * This is just so that we don't run out of memory while recording a lot
   * of spans. At some point we just stop and flush out the start of the
   * trace tree (i.e.the first n spans with the smallest
   * start_timestamp).
   */
   add(span) {
    if (this.spans.length > this._maxlen) {
      span.spanRecorder = undefined;
    } else {
      this.spans.push(span);
    }
  }
}

/**
 * Span contains all data about a span
 */
class Span  {
  /**
   * @inheritDoc
   */
   __init2() {this.traceId = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.uuid4)();}

  /**
   * @inheritDoc
   */
   __init3() {this.spanId = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.uuid4)().substring(16);}

  /**
   * @inheritDoc
   */
  

  /**
   * Internal keeper of the status
   */
  

  /**
   * @inheritDoc
   */
  

  /**
   * Timestamp in seconds when the span was created.
   */
   __init4() {this.startTimestamp = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.timestampWithMs)();}

  /**
   * Timestamp in seconds when the span ended.
   */
  

  /**
   * @inheritDoc
   */
  

  /**
   * @inheritDoc
   */
  

  /**
   * @inheritDoc
   */
   __init5() {this.tags = {};}

  /**
   * @inheritDoc
   */
     __init6() {this.data = {};}

  /**
   * List of spans that were finalized
   */
  

  /**
   * @inheritDoc
   */
  

  /**
   * You should never call the constructor manually, always use `Sentry.startTransaction()`
   * or call `startChild()` on an existing span.
   * @internal
   * @hideconstructor
   * @hidden
   */
   constructor(spanContext) {;Span.prototype.__init2.call(this);Span.prototype.__init3.call(this);Span.prototype.__init4.call(this);Span.prototype.__init5.call(this);Span.prototype.__init6.call(this);
    if (!spanContext) {
      return this;
    }
    if (spanContext.traceId) {
      this.traceId = spanContext.traceId;
    }
    if (spanContext.spanId) {
      this.spanId = spanContext.spanId;
    }
    if (spanContext.parentSpanId) {
      this.parentSpanId = spanContext.parentSpanId;
    }
    // We want to include booleans as well here
    if ('sampled' in spanContext) {
      this.sampled = spanContext.sampled;
    }
    if (spanContext.op) {
      this.op = spanContext.op;
    }
    if (spanContext.description) {
      this.description = spanContext.description;
    }
    if (spanContext.data) {
      this.data = spanContext.data;
    }
    if (spanContext.tags) {
      this.tags = spanContext.tags;
    }
    if (spanContext.status) {
      this.status = spanContext.status;
    }
    if (spanContext.startTimestamp) {
      this.startTimestamp = spanContext.startTimestamp;
    }
    if (spanContext.endTimestamp) {
      this.endTimestamp = spanContext.endTimestamp;
    }
  }

  /**
   * @inheritDoc
   */
   startChild(
    spanContext,
  ) {
    var childSpan = new Span({
      ...spanContext,
      parentSpanId: this.spanId,
      sampled: this.sampled,
      traceId: this.traceId,
    });

    childSpan.spanRecorder = this.spanRecorder;
    if (childSpan.spanRecorder) {
      childSpan.spanRecorder.add(childSpan);
    }

    childSpan.transaction = this.transaction;

    if ((typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && childSpan.transaction) {
      var opStr = (spanContext && spanContext.op) || '< unknown op >';
      var nameStr = childSpan.transaction.name || '< unknown name >';
      var idStr = childSpan.transaction.spanId;

      var logMessage = `[Tracing] Starting '${opStr}' span on transaction '${nameStr}' (${idStr}).`;
      childSpan.transaction.metadata.spanMetadata[childSpan.spanId] = { logMessage };
      _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.log(logMessage);
    }

    return childSpan;
  }

  /**
   * @inheritDoc
   */
   setTag(key, value) {
    this.tags = { ...this.tags, [key]: value };
    return this;
  }

  /**
   * @inheritDoc
   */
     setData(key, value) {
    this.data = { ...this.data, [key]: value };
    return this;
  }

  /**
   * @inheritDoc
   */
   setStatus(value) {
    this.status = value;
    return this;
  }

  /**
   * @inheritDoc
   */
   setHttpStatus(httpStatus) {
    this.setTag('http.status_code', String(httpStatus));
    var spanStatus = spanStatusfromHttpCode(httpStatus);
    if (spanStatus !== 'unknown_error') {
      this.setStatus(spanStatus);
    }
    return this;
  }

  /**
   * @inheritDoc
   */
   isSuccess() {
    return this.status === 'ok';
  }

  /**
   * @inheritDoc
   */
   finish(endTimestamp) {
    if (
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
      // Don't call this for transactions
      this.transaction &&
      this.transaction.spanId !== this.spanId
    ) {
      const { logMessage } = this.transaction.metadata.spanMetadata[this.spanId];
      if (logMessage) {
        _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.log((logMessage ).replace('Starting', 'Finishing'));
      }
    }

    this.endTimestamp = typeof endTimestamp === 'number' ? endTimestamp : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.timestampWithMs)();
  }

  /**
   * @inheritDoc
   */
   toTraceparent() {
    let sampledString = '';
    if (this.sampled !== undefined) {
      sampledString = this.sampled ? '-1' : '-0';
    }
    return `${this.traceId}-${this.spanId}${sampledString}`;
  }

  /**
   * @inheritDoc
   */
   toContext() {
    return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.dropUndefinedKeys)({
      data: this.data,
      description: this.description,
      endTimestamp: this.endTimestamp,
      op: this.op,
      parentSpanId: this.parentSpanId,
      sampled: this.sampled,
      spanId: this.spanId,
      startTimestamp: this.startTimestamp,
      status: this.status,
      tags: this.tags,
      traceId: this.traceId,
    });
  }

  /**
   * @inheritDoc
   */
   updateWithContext(spanContext) {
    this.data = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._nullishCoalesce)(spanContext.data, () => ( {}));
    this.description = spanContext.description;
    this.endTimestamp = spanContext.endTimestamp;
    this.op = spanContext.op;
    this.parentSpanId = spanContext.parentSpanId;
    this.sampled = spanContext.sampled;
    this.spanId = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._nullishCoalesce)(spanContext.spanId, () => ( this.spanId));
    this.startTimestamp = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._nullishCoalesce)(spanContext.startTimestamp, () => ( this.startTimestamp));
    this.status = spanContext.status;
    this.tags = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._nullishCoalesce)(spanContext.tags, () => ( {}));
    this.traceId = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._nullishCoalesce)(spanContext.traceId, () => ( this.traceId));

    return this;
  }

  /**
   * @inheritDoc
   */
   getTraceContext()

 {
    return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.dropUndefinedKeys)({
      data: Object.keys(this.data).length > 0 ? this.data : undefined,
      description: this.description,
      op: this.op,
      parent_span_id: this.parentSpanId,
      span_id: this.spanId,
      status: this.status,
      tags: Object.keys(this.tags).length > 0 ? this.tags : undefined,
      trace_id: this.traceId,
    });
  }

  /**
   * @inheritDoc
   */
   toJSON()

 {
    return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.dropUndefinedKeys)({
      data: Object.keys(this.data).length > 0 ? this.data : undefined,
      description: this.description,
      op: this.op,
      parent_span_id: this.parentSpanId,
      span_id: this.spanId,
      start_timestamp: this.startTimestamp,
      status: this.status,
      tags: Object.keys(this.tags).length > 0 ? this.tags : undefined,
      timestamp: this.endTimestamp,
      trace_id: this.traceId,
    });
  }
}

/**
 * Converts a HTTP status code into a {@link SpanStatusType}.
 *
 * @param httpStatus The HTTP response status code.
 * @returns The span status or unknown_error.
 */
function spanStatusfromHttpCode(httpStatus) {
  if (httpStatus < 400 && httpStatus >= 100) {
    return 'ok';
  }

  if (httpStatus >= 400 && httpStatus < 500) {
    switch (httpStatus) {
      case 401:
        return 'unauthenticated';
      case 403:
        return 'permission_denied';
      case 404:
        return 'not_found';
      case 409:
        return 'already_exists';
      case 413:
        return 'failed_precondition';
      case 429:
        return 'resource_exhausted';
      default:
        return 'invalid_argument';
    }
  }

  if (httpStatus >= 500 && httpStatus < 600) {
    switch (httpStatus) {
      case 501:
        return 'unimplemented';
      case 503:
        return 'unavailable';
      case 504:
        return 'deadline_exceeded';
      default:
        return 'internal_error';
    }
  }

  return 'unknown_error';
}


//# sourceMappingURL=span.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/spanstatus.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpanStatus": () => (/* binding */ SpanStatus)
/* harmony export */ });
/** The status of an Span.
 *
 * @deprecated Use string literals - if you require type casting, cast to SpanStatusType type
 */
var SpanStatus; (function (SpanStatus) {
  /** The operation completed successfully. */
  var Ok = 'ok'; SpanStatus["Ok"] = Ok;
  /** Deadline expired before operation could complete. */
  var DeadlineExceeded = 'deadline_exceeded'; SpanStatus["DeadlineExceeded"] = DeadlineExceeded;
  /** 401 Unauthorized (actually does mean unauthenticated according to RFC 7235) */
  var Unauthenticated = 'unauthenticated'; SpanStatus["Unauthenticated"] = Unauthenticated;
  /** 403 Forbidden */
  var PermissionDenied = 'permission_denied'; SpanStatus["PermissionDenied"] = PermissionDenied;
  /** 404 Not Found. Some requested entity (file or directory) was not found. */
  var NotFound = 'not_found'; SpanStatus["NotFound"] = NotFound;
  /** 429 Too Many Requests */
  var ResourceExhausted = 'resource_exhausted'; SpanStatus["ResourceExhausted"] = ResourceExhausted;
  /** Client specified an invalid argument. 4xx. */
  var InvalidArgument = 'invalid_argument'; SpanStatus["InvalidArgument"] = InvalidArgument;
  /** 501 Not Implemented */
  var Unimplemented = 'unimplemented'; SpanStatus["Unimplemented"] = Unimplemented;
  /** 503 Service Unavailable */
  var Unavailable = 'unavailable'; SpanStatus["Unavailable"] = Unavailable;
  /** Other/generic 5xx. */
  var InternalError = 'internal_error'; SpanStatus["InternalError"] = InternalError;
  /** Unknown. Any non-standard HTTP status code. */
  var UnknownError = 'unknown_error'; SpanStatus["UnknownError"] = UnknownError;
  /** The operation was cancelled (typically by the user). */
  var Cancelled = 'cancelled'; SpanStatus["Cancelled"] = Cancelled;
  /** Already exists (409) */
  var AlreadyExists = 'already_exists'; SpanStatus["AlreadyExists"] = AlreadyExists;
  /** Operation was rejected because the system is not in a state required for the operation's */
  var FailedPrecondition = 'failed_precondition'; SpanStatus["FailedPrecondition"] = FailedPrecondition;
  /** The operation was aborted, typically due to a concurrency issue. */
  var Aborted = 'aborted'; SpanStatus["Aborted"] = Aborted;
  /** Operation was attempted past the valid range. */
  var OutOfRange = 'out_of_range'; SpanStatus["OutOfRange"] = OutOfRange;
  /** Unrecoverable data loss or corruption */
  var DataLoss = 'data_loss'; SpanStatus["DataLoss"] = DataLoss;
})(SpanStatus || (SpanStatus = {}));


//# sourceMappingURL=spanstatus.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/transaction.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Transaction": () => (/* binding */ Transaction)
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/buildPolyfills/_nullishCoalesce.js");
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/hub/esm/hub.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/time.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/object.js");
/* harmony import */ var _span_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/esm/span.js");





/** JSDoc */
class Transaction extends _span_js__WEBPACK_IMPORTED_MODULE_0__.Span  {
  

  /**
   * The reference to the current hub.
   */
  

   __init() {this._measurements = {};}

   __init2() {this._frozenDynamicSamplingContext = undefined;}

  /**
   * This constructor should never be called manually. Those instrumenting tracing should use
   * `Sentry.startTransaction()`, and internal methods should use `hub.startTransaction()`.
   * @internal
   * @hideconstructor
   * @hidden
   */
   constructor(transactionContext, hub) {
    super(transactionContext);Transaction.prototype.__init.call(this);Transaction.prototype.__init2.call(this);;

    this._hub = hub || (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_1__.getCurrentHub)();

    this._name = transactionContext.name || '';

    this.metadata = {
      source: 'custom',
      ...transactionContext.metadata,
      spanMetadata: {},
      changes: [],
      propagations: 0,
    };

    this._trimEnd = transactionContext.trimEnd;

    // this is because transactions are also spans, and spans have a transaction pointer
    this.transaction = this;

    // If Dynamic Sampling Context is provided during the creation of the transaction, we freeze it as it usually means
    // there is incoming Dynamic Sampling Context. (Either through an incoming request, a baggage meta-tag, or other means)
    var incomingDynamicSamplingContext = this.metadata.dynamicSamplingContext;
    if (incomingDynamicSamplingContext) {
      // We shallow copy this in case anything writes to the original reference of the passed in `dynamicSamplingContext`
      this._frozenDynamicSamplingContext = { ...incomingDynamicSamplingContext };
    }
  }

  /** Getter for `name` property */
   get name() {
    return this._name;
  }

  /** Setter for `name` property, which also sets `source` as custom */
   set name(newName) {
    this.setName(newName);
  }

  /**
   * JSDoc
   */
   setName(name, source = 'custom') {
    // `source` could change without the name changing if we discover that an unparameterized route is actually
    // parameterized by virtue of having no parameters in its path
    if (name !== this.name || source !== this.metadata.source) {
      this.metadata.changes.push({
        // log previous source
        source: this.metadata.source,
        timestamp: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.timestampInSeconds)(),
        propagations: this.metadata.propagations,
      });
    }

    this._name = name;
    this.metadata.source = source;
  }

  /**
   * Attaches SpanRecorder to the span itself
   * @param maxlen maximum number of spans that can be recorded
   */
   initSpanRecorder(maxlen = 1000) {
    if (!this.spanRecorder) {
      this.spanRecorder = new _span_js__WEBPACK_IMPORTED_MODULE_0__.SpanRecorder(maxlen);
    }
    this.spanRecorder.add(this);
  }

  /**
   * @inheritDoc
   */
   setMeasurement(name, value, unit = '') {
    this._measurements[name] = { value, unit };
  }

  /**
   * @inheritDoc
   */
   setMetadata(newMetadata) {
    this.metadata = { ...this.metadata, ...newMetadata };
  }

  /**
   * @inheritDoc
   */
   finish(endTimestamp) {
    // This transaction is already finished, so we should not flush it again.
    if (this.endTimestamp !== undefined) {
      return undefined;
    }

    if (!this.name) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.warn('Transaction has no name, falling back to `<unlabeled transaction>`.');
      this.name = '<unlabeled transaction>';
    }

    // just sets the end timestamp
    super.finish(endTimestamp);

    if (this.sampled !== true) {
      // At this point if `sampled !== true` we want to discard the transaction.
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log('[Tracing] Discarding transaction because its trace was not chosen to be sampled.');

      var client = this._hub.getClient();
      if (client) {
        client.recordDroppedEvent('sample_rate', 'transaction');
      }

      return undefined;
    }

    var finishedSpans = this.spanRecorder ? this.spanRecorder.spans.filter(s => s !== this && s.endTimestamp) : [];

    if (this._trimEnd && finishedSpans.length > 0) {
      this.endTimestamp = finishedSpans.reduce((prev, current) => {
        if (prev.endTimestamp && current.endTimestamp) {
          return prev.endTimestamp > current.endTimestamp ? prev : current;
        }
        return prev;
      }).endTimestamp;
    }

    var metadata = this.metadata;

    var transaction = {
      contexts: {
        trace: this.getTraceContext(),
      },
      spans: finishedSpans,
      start_timestamp: this.startTimestamp,
      tags: this.tags,
      timestamp: this.endTimestamp,
      transaction: this.name,
      type: 'transaction',
      sdkProcessingMetadata: {
        ...metadata,
        dynamicSamplingContext: this.getDynamicSamplingContext(),
      },
      ...(metadata.source && {
        transaction_info: {
          source: metadata.source,
          changes: metadata.changes,
          propagations: metadata.propagations,
        },
      }),
    };

    var hasMeasurements = Object.keys(this._measurements).length > 0;

    if (hasMeasurements) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
        _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log(
          '[Measurements] Adding measurements to transaction',
          JSON.stringify(this._measurements, undefined, 2),
        );
      transaction.measurements = this._measurements;
    }

    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log(`[Tracing] Finishing ${this.op} transaction: ${this.name}.`);

    return this._hub.captureEvent(transaction);
  }

  /**
   * @inheritDoc
   */
   toContext() {
    var spanContext = super.toContext();

    return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.dropUndefinedKeys)({
      ...spanContext,
      name: this.name,
      trimEnd: this._trimEnd,
    });
  }

  /**
   * @inheritDoc
   */
   updateWithContext(transactionContext) {
    super.updateWithContext(transactionContext);

    this.name = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__._nullishCoalesce)(transactionContext.name, () => ( ''));

    this._trimEnd = transactionContext.trimEnd;

    return this;
  }

  /**
   * @inheritdoc
   *
   * @experimental
   */
   getDynamicSamplingContext() {
    if (this._frozenDynamicSamplingContext) {
      return this._frozenDynamicSamplingContext;
    }

    var hub = this._hub || (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_1__.getCurrentHub)();
    var client = hub && hub.getClient();

    if (!client) return {};

    const { environment, release } = client.getOptions() || {};
    const { publicKey: public_key } = client.getDsn() || {};

    var maybeSampleRate = (this.metadata.transactionSampling || {}).rate;
    var sample_rate = maybeSampleRate !== undefined ? maybeSampleRate.toString() : undefined;

    var scope = hub.getScope();
    const { segment: user_segment } = (scope && scope.getUser()) || {};

    var source = this.metadata.source;

    // We don't want to have a transaction name in the DSC if the source is "url" because URLs might contain PII
    var transaction = source && source !== 'url' ? this.name : undefined;

    var dsc = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.dropUndefinedKeys)({
      environment,
      release,
      transaction,
      user_segment,
      public_key,
      trace_id: this.traceId,
      sample_rate,
    });

    // Uncomment if we want to make DSC immutable
    // this._frozenDynamicSamplingContext = dsc;

    return dsc;
  }
}


//# sourceMappingURL=transaction.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/esm/utils.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TRACEPARENT_REGEXP": () => (/* reexport safe */ _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.TRACEPARENT_REGEXP),
/* harmony export */   "extractTraceparentData": () => (/* reexport safe */ _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.extractTraceparentData),
/* harmony export */   "getActiveTransaction": () => (/* binding */ getActiveTransaction),
/* harmony export */   "hasTracingEnabled": () => (/* binding */ hasTracingEnabled),
/* harmony export */   "msToSec": () => (/* binding */ msToSec),
/* harmony export */   "secToMs": () => (/* binding */ secToMs),
/* harmony export */   "stripUrlQueryAndFragment": () => (/* reexport safe */ _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.stripUrlQueryAndFragment)
/* harmony export */ });
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/hub/esm/hub.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/tracing.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/url.js");



/**
 * Determines if tracing is currently enabled.
 *
 * Tracing is enabled when at least one of `tracesSampleRate` and `tracesSampler` is defined in the SDK config.
 */
function hasTracingEnabled(
  maybeOptions,
) {
  var client = (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_2__.getCurrentHub)().getClient();
  var options = maybeOptions || (client && client.getOptions());
  return !!options && ('tracesSampleRate' in options || 'tracesSampler' in options);
}

/** Grabs active transaction off scope, if any */
function getActiveTransaction(maybeHub) {
  var hub = maybeHub || (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_2__.getCurrentHub)();
  var scope = hub.getScope();
  return scope && (scope.getTransaction() );
}

/**
 * Converts from milliseconds to seconds
 * @param time time in ms
 */
function msToSec(time) {
  return time / 1000;
}

/**
 * Converts from seconds to milliseconds
 * @param time time in seconds
 */
function secToMs(time) {
  return time * 1000;
}


//# sourceMappingURL=utils.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/hub/esm/hub.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "API_VERSION": () => (/* binding */ API_VERSION),
/* harmony export */   "Hub": () => (/* binding */ Hub),
/* harmony export */   "getCurrentHub": () => (/* binding */ getCurrentHub),
/* harmony export */   "getHubFromCarrier": () => (/* binding */ getHubFromCarrier),
/* harmony export */   "getMainCarrier": () => (/* binding */ getMainCarrier),
/* harmony export */   "makeMain": () => (/* binding */ makeMain),
/* harmony export */   "setHubOnCarrier": () => (/* binding */ setHubOnCarrier)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/misc.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/time.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/global.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/node.js");
/* harmony import */ var _scope_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/hub/esm/scope.js");
/* harmony import */ var _session_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/hub/esm/session.js");




/**
 * API compatibility version of this hub.
 *
 * WARNING: This number should only be increased when the global interface
 * changes and new methods are introduced.
 *
 * @hidden
 */
var API_VERSION = 4;

/**
 * Default maximum number of breadcrumbs added to an event. Can be overwritten
 * with {@link Options.maxBreadcrumbs}.
 */
var DEFAULT_BREADCRUMBS = 100;

/**
 * A layer in the process stack.
 * @hidden
 */

/**
 * @inheritDoc
 */
class Hub  {
  /** Is a {@link Layer}[] containing the client and scope */
    __init() {this._stack = [{}];}

  /** Contains the last event id of a captured event.  */
  

  /**
   * Creates a new instance of the hub, will push one {@link Layer} into the
   * internal stack on creation.
   *
   * @param client bound to the hub.
   * @param scope bound to the hub.
   * @param version number, higher number means higher priority.
   */
   constructor(client, scope = new _scope_js__WEBPACK_IMPORTED_MODULE_0__.Scope(),   _version = API_VERSION) {;this._version = _version;Hub.prototype.__init.call(this);
    this.getStackTop().scope = scope;
    if (client) {
      this.bindClient(client);
    }
  }

  /**
   * @inheritDoc
   */
   isOlderThan(version) {
    return this._version < version;
  }

  /**
   * @inheritDoc
   */
   bindClient(client) {
    var top = this.getStackTop();
    top.client = client;
    if (client && client.setupIntegrations) {
      client.setupIntegrations();
    }
  }

  /**
   * @inheritDoc
   */
   pushScope() {
    // We want to clone the content of prev scope
    var scope = _scope_js__WEBPACK_IMPORTED_MODULE_0__.Scope.clone(this.getScope());
    this.getStack().push({
      client: this.getClient(),
      scope,
    });
    return scope;
  }

  /**
   * @inheritDoc
   */
   popScope() {
    if (this.getStack().length <= 1) return false;
    return !!this.getStack().pop();
  }

  /**
   * @inheritDoc
   */
   withScope(callback) {
    var scope = this.pushScope();
    try {
      callback(scope);
    } finally {
      this.popScope();
    }
  }

  /**
   * @inheritDoc
   */
   getClient() {
    return this.getStackTop().client ;
  }

  /** Returns the scope of the top stack. */
   getScope() {
    return this.getStackTop().scope;
  }

  /** Returns the scope stack for domains or the process. */
   getStack() {
    return this._stack;
  }

  /** Returns the topmost scope layer in the order domain > local > process. */
   getStackTop() {
    return this._stack[this._stack.length - 1];
  }

  /**
   * @inheritDoc
   */
     captureException(exception, hint) {
    var eventId = (this._lastEventId = hint && hint.event_id ? hint.event_id : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.uuid4)());
    var syntheticException = new Error('Sentry syntheticException');
    this._withClient((client, scope) => {
      client.captureException(
        exception,
        {
          originalException: exception,
          syntheticException,
          ...hint,
          event_id: eventId,
        },
        scope,
      );
    });
    return eventId;
  }

  /**
   * @inheritDoc
   */
   captureMessage(
    message,
        level,
    hint,
  ) {
    var eventId = (this._lastEventId = hint && hint.event_id ? hint.event_id : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.uuid4)());
    var syntheticException = new Error(message);
    this._withClient((client, scope) => {
      client.captureMessage(
        message,
        level,
        {
          originalException: message,
          syntheticException,
          ...hint,
          event_id: eventId,
        },
        scope,
      );
    });
    return eventId;
  }

  /**
   * @inheritDoc
   */
   captureEvent(event, hint) {
    var eventId = hint && hint.event_id ? hint.event_id : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.uuid4)();
    if (event.type !== 'transaction') {
      this._lastEventId = eventId;
    }

    this._withClient((client, scope) => {
      client.captureEvent(event, { ...hint, event_id: eventId }, scope);
    });
    return eventId;
  }

  /**
   * @inheritDoc
   */
   lastEventId() {
    return this._lastEventId;
  }

  /**
   * @inheritDoc
   */
   addBreadcrumb(breadcrumb, hint) {
    const { scope, client } = this.getStackTop();

    if (!scope || !client) return;

        const { beforeBreadcrumb = null, maxBreadcrumbs = DEFAULT_BREADCRUMBS } =
      (client.getOptions && client.getOptions()) || {};

    if (maxBreadcrumbs <= 0) return;

    var timestamp = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.dateTimestampInSeconds)();
    var mergedBreadcrumb = { timestamp, ...breadcrumb };
    var finalBreadcrumb = beforeBreadcrumb
      ? ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.consoleSandbox)(() => beforeBreadcrumb(mergedBreadcrumb, hint)) )
      : mergedBreadcrumb;

    if (finalBreadcrumb === null) return;

    scope.addBreadcrumb(finalBreadcrumb, maxBreadcrumbs);
  }

  /**
   * @inheritDoc
   */
   setUser(user) {
    var scope = this.getScope();
    if (scope) scope.setUser(user);
  }

  /**
   * @inheritDoc
   */
   setTags(tags) {
    var scope = this.getScope();
    if (scope) scope.setTags(tags);
  }

  /**
   * @inheritDoc
   */
   setExtras(extras) {
    var scope = this.getScope();
    if (scope) scope.setExtras(extras);
  }

  /**
   * @inheritDoc
   */
   setTag(key, value) {
    var scope = this.getScope();
    if (scope) scope.setTag(key, value);
  }

  /**
   * @inheritDoc
   */
   setExtra(key, extra) {
    var scope = this.getScope();
    if (scope) scope.setExtra(key, extra);
  }

  /**
   * @inheritDoc
   */
     setContext(name, context) {
    var scope = this.getScope();
    if (scope) scope.setContext(name, context);
  }

  /**
   * @inheritDoc
   */
   configureScope(callback) {
    const { scope, client } = this.getStackTop();
    if (scope && client) {
      callback(scope);
    }
  }

  /**
   * @inheritDoc
   */
   run(callback) {
    var oldHub = makeMain(this);
    try {
      callback(this);
    } finally {
      makeMain(oldHub);
    }
  }

  /**
   * @inheritDoc
   */
   getIntegration(integration) {
    var client = this.getClient();
    if (!client) return null;
    try {
      return client.getIntegration(integration);
    } catch (_oO) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.warn(`Cannot retrieve integration ${integration.id} from the current Hub`);
      return null;
    }
  }

  /**
   * @inheritDoc
   */
   startTransaction(context, customSamplingContext) {
    return this._callExtensionMethod('startTransaction', context, customSamplingContext);
  }

  /**
   * @inheritDoc
   */
   traceHeaders() {
    return this._callExtensionMethod('traceHeaders');
  }

  /**
   * @inheritDoc
   */
   captureSession(endSession = false) {
    // both send the update and pull the session from the scope
    if (endSession) {
      return this.endSession();
    }

    // only send the update
    this._sendSessionUpdate();
  }

  /**
   * @inheritDoc
   */
   endSession() {
    var layer = this.getStackTop();
    var scope = layer && layer.scope;
    var session = scope && scope.getSession();
    if (session) {
      (0,_session_js__WEBPACK_IMPORTED_MODULE_4__.closeSession)(session);
    }
    this._sendSessionUpdate();

    // the session is over; take it off of the scope
    if (scope) {
      scope.setSession();
    }
  }

  /**
   * @inheritDoc
   */
   startSession(context) {
    const { scope, client } = this.getStackTop();
    const { release, environment } = (client && client.getOptions()) || {};

    // Will fetch userAgent if called from browser sdk
    var global = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.getGlobalObject)();
    const { userAgent } = global.navigator || {};

    var session = (0,_session_js__WEBPACK_IMPORTED_MODULE_4__.makeSession)({
      release,
      environment,
      ...(scope && { user: scope.getUser() }),
      ...(userAgent && { userAgent }),
      ...context,
    });

    if (scope) {
      // End existing session if there's one
      var currentSession = scope.getSession && scope.getSession();
      if (currentSession && currentSession.status === 'ok') {
        (0,_session_js__WEBPACK_IMPORTED_MODULE_4__.updateSession)(currentSession, { status: 'exited' });
      }
      this.endSession();

      // Afterwards we set the new session on the scope
      scope.setSession(session);
    }

    return session;
  }

  /**
   * Returns if default PII should be sent to Sentry and propagated in ourgoing requests
   * when Tracing is used.
   */
   shouldSendDefaultPii() {
    var client = this.getClient();
    var options = client && client.getOptions();
    return Boolean(options && options.sendDefaultPii);
  }

  /**
   * Sends the current Session on the scope
   */
   _sendSessionUpdate() {
    const { scope, client } = this.getStackTop();
    if (!scope) return;

    var session = scope.getSession();
    if (session) {
      if (client && client.captureSession) {
        client.captureSession(session);
      }
    }
  }

  /**
   * Internal helper function to call a method on the top client if it exists.
   *
   * @param method The method to call on the client.
   * @param args Arguments to pass to the client function.
   */
   _withClient(callback) {
    const { scope, client } = this.getStackTop();
    if (client) {
      callback(client, scope);
    }
  }

  /**
   * Calls global extension method and binding current instance to the function call
   */
  // @ts-ignore Function lacks ending return statement and return type does not include 'undefined'. ts(2366)
     _callExtensionMethod(method, ...args) {
    var carrier = getMainCarrier();
    var sentry = carrier.__SENTRY__;
    if (sentry && sentry.extensions && typeof sentry.extensions[method] === 'function') {
      return sentry.extensions[method].apply(this, args);
    }
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.warn(`Extension method ${method} couldn't be found, doing nothing.`);
  }
}

/**
 * Returns the global shim registry.
 *
 * FIXME: This function is problematic, because despite always returning a valid Carrier,
 * it has an optional `__SENTRY__` property, which then in turn requires us to always perform an unnecessary check
 * at the call-site. We always access the carrier through this function, so we can guarantee that `__SENTRY__` is there.
 **/
function getMainCarrier() {
  var carrier = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.getGlobalObject)();
  carrier.__SENTRY__ = carrier.__SENTRY__ || {
    extensions: {},
    hub: undefined,
  };
  return carrier;
}

/**
 * Replaces the current main hub with the passed one on the global object
 *
 * @returns The old replaced hub
 */
function makeMain(hub) {
  var registry = getMainCarrier();
  var oldHub = getHubFromCarrier(registry);
  setHubOnCarrier(registry, hub);
  return oldHub;
}

/**
 * Returns the default hub instance.
 *
 * If a hub is already registered in the global carrier but this module
 * contains a more recent version, it replaces the registered version.
 * Otherwise, the currently registered hub will be returned.
 */
function getCurrentHub() {
  // Get main carrier (global for every environment)
  var registry = getMainCarrier();

  // If there's no hub, or its an old API, assign a new one
  if (!hasHubOnCarrier(registry) || getHubFromCarrier(registry).isOlderThan(API_VERSION)) {
    setHubOnCarrier(registry, new Hub());
  }

  // Prefer domains over global if they are there (applicable only to Node environment)
  if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.isNodeEnv)()) {
    return getHubFromActiveDomain(registry);
  }
  // Return hub that lives on a global object
  return getHubFromCarrier(registry);
}

/**
 * Try to read the hub from an active domain, and fallback to the registry if one doesn't exist
 * @returns discovered hub
 */
function getHubFromActiveDomain(registry) {
  try {
    var sentry = getMainCarrier().__SENTRY__;
    var activeDomain = sentry && sentry.extensions && sentry.extensions.domain && sentry.extensions.domain.active;

    // If there's no active domain, just return global hub
    if (!activeDomain) {
      return getHubFromCarrier(registry);
    }

    // If there's no hub on current domain, or it's an old API, assign a new one
    if (!hasHubOnCarrier(activeDomain) || getHubFromCarrier(activeDomain).isOlderThan(API_VERSION)) {
      var registryHubTopStack = getHubFromCarrier(registry).getStackTop();
      setHubOnCarrier(activeDomain, new Hub(registryHubTopStack.client, _scope_js__WEBPACK_IMPORTED_MODULE_0__.Scope.clone(registryHubTopStack.scope)));
    }

    // Return hub that lives on a domain
    return getHubFromCarrier(activeDomain);
  } catch (_Oo) {
    // Return hub that lives on a global object
    return getHubFromCarrier(registry);
  }
}

/**
 * This will tell whether a carrier has a hub on it or not
 * @param carrier object
 */
function hasHubOnCarrier(carrier) {
  return !!(carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub);
}

/**
 * This will create a new {@link Hub} and add to the passed object on
 * __SENTRY__.hub.
 * @param carrier object
 * @hidden
 */
function getHubFromCarrier(carrier) {
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.getGlobalSingleton)('hub', () => new Hub(), carrier);
}

/**
 * This will set passed {@link Hub} on the passed object's __SENTRY__.hub attribute
 * @param carrier object
 * @param hub Hub
 * @returns A boolean indicating success or failure
 */
function setHubOnCarrier(carrier, hub) {
  if (!carrier) return false;
  var __SENTRY__ = (carrier.__SENTRY__ = carrier.__SENTRY__ || {});
  __SENTRY__.hub = hub;
  return true;
}


//# sourceMappingURL=hub.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/hub/esm/scope.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Scope": () => (/* binding */ Scope),
/* harmony export */   "addGlobalEventProcessor": () => (/* binding */ addGlobalEventProcessor)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/is.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/time.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/syncpromise.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/misc.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/global.js");
/* harmony import */ var _session_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/hub/esm/session.js");



/**
 * Absolute maximum number of breadcrumbs added to an event.
 * The `maxBreadcrumbs` option cannot be higher than this value.
 */
var MAX_BREADCRUMBS = 100;

/**
 * Holds additional event information. {@link Scope.applyToEvent} will be
 * called by the client before an event will be sent.
 */
class Scope  {
  /** Flag if notifying is happening. */
  

  /** Callback for client to receive scope changes. */
  

  /** Callback list that will be called after {@link applyToEvent}. */
  

  /** Array of breadcrumbs. */
  

  /** User */
  

  /** Tags */
  

  /** Extra */
  

  /** Contexts */
  

  /** Attachments */
  

  /**
   * A place to stash data which is needed at some point in the SDK's event processing pipeline but which shouldn't get
   * sent to Sentry
   */
  

  /** Fingerprint */
  

  /** Severity */
    

  /** Transaction Name */
  

  /** Span */
  

  /** Session */
  

  /** Request Mode Session Status */
  

   constructor() {
    this._notifyingListeners = false;
    this._scopeListeners = [];
    this._eventProcessors = [];
    this._breadcrumbs = [];
    this._attachments = [];
    this._user = {};
    this._tags = {};
    this._extra = {};
    this._contexts = {};
    this._sdkProcessingMetadata = {};
  }

  /**
   * Inherit values from the parent scope.
   * @param scope to clone.
   */
   static clone(scope) {
    var newScope = new Scope();
    if (scope) {
      newScope._breadcrumbs = [...scope._breadcrumbs];
      newScope._tags = { ...scope._tags };
      newScope._extra = { ...scope._extra };
      newScope._contexts = { ...scope._contexts };
      newScope._user = scope._user;
      newScope._level = scope._level;
      newScope._span = scope._span;
      newScope._session = scope._session;
      newScope._transactionName = scope._transactionName;
      newScope._fingerprint = scope._fingerprint;
      newScope._eventProcessors = [...scope._eventProcessors];
      newScope._requestSession = scope._requestSession;
      newScope._attachments = [...scope._attachments];
    }
    return newScope;
  }

  /**
   * Add internal on change listener. Used for sub SDKs that need to store the scope.
   * @hidden
   */
   addScopeListener(callback) {
    this._scopeListeners.push(callback);
  }

  /**
   * @inheritDoc
   */
   addEventProcessor(callback) {
    this._eventProcessors.push(callback);
    return this;
  }

  /**
   * @inheritDoc
   */
   setUser(user) {
    this._user = user || {};
    if (this._session) {
      (0,_session_js__WEBPACK_IMPORTED_MODULE_0__.updateSession)(this._session, { user });
    }
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   getUser() {
    return this._user;
  }

  /**
   * @inheritDoc
   */
   getRequestSession() {
    return this._requestSession;
  }

  /**
   * @inheritDoc
   */
   setRequestSession(requestSession) {
    this._requestSession = requestSession;
    return this;
  }

  /**
   * @inheritDoc
   */
   setTags(tags) {
    this._tags = {
      ...this._tags,
      ...tags,
    };
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setTag(key, value) {
    this._tags = { ...this._tags, [key]: value };
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setExtras(extras) {
    this._extra = {
      ...this._extra,
      ...extras,
    };
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setExtra(key, extra) {
    this._extra = { ...this._extra, [key]: extra };
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setFingerprint(fingerprint) {
    this._fingerprint = fingerprint;
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setLevel(
        level,
  ) {
    this._level = level;
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setTransactionName(name) {
    this._transactionName = name;
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setContext(key, context) {
    if (context === null) {
            delete this._contexts[key];
    } else {
      this._contexts = { ...this._contexts, [key]: context };
    }

    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   setSpan(span) {
    this._span = span;
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   getSpan() {
    return this._span;
  }

  /**
   * @inheritDoc
   */
   getTransaction() {
    // Often, this span (if it exists at all) will be a transaction, but it's not guaranteed to be. Regardless, it will
    // have a pointer to the currently-active transaction.
    var span = this.getSpan();
    return span && span.transaction;
  }

  /**
   * @inheritDoc
   */
   setSession(session) {
    if (!session) {
      delete this._session;
    } else {
      this._session = session;
    }
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   getSession() {
    return this._session;
  }

  /**
   * @inheritDoc
   */
   update(captureContext) {
    if (!captureContext) {
      return this;
    }

    if (typeof captureContext === 'function') {
      var updatedScope = (captureContext )(this);
      return updatedScope instanceof Scope ? updatedScope : this;
    }

    if (captureContext instanceof Scope) {
      this._tags = { ...this._tags, ...captureContext._tags };
      this._extra = { ...this._extra, ...captureContext._extra };
      this._contexts = { ...this._contexts, ...captureContext._contexts };
      if (captureContext._user && Object.keys(captureContext._user).length) {
        this._user = captureContext._user;
      }
      if (captureContext._level) {
        this._level = captureContext._level;
      }
      if (captureContext._fingerprint) {
        this._fingerprint = captureContext._fingerprint;
      }
      if (captureContext._requestSession) {
        this._requestSession = captureContext._requestSession;
      }
    } else if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(captureContext)) {
            captureContext = captureContext ;
      this._tags = { ...this._tags, ...captureContext.tags };
      this._extra = { ...this._extra, ...captureContext.extra };
      this._contexts = { ...this._contexts, ...captureContext.contexts };
      if (captureContext.user) {
        this._user = captureContext.user;
      }
      if (captureContext.level) {
        this._level = captureContext.level;
      }
      if (captureContext.fingerprint) {
        this._fingerprint = captureContext.fingerprint;
      }
      if (captureContext.requestSession) {
        this._requestSession = captureContext.requestSession;
      }
    }

    return this;
  }

  /**
   * @inheritDoc
   */
   clear() {
    this._breadcrumbs = [];
    this._tags = {};
    this._extra = {};
    this._user = {};
    this._contexts = {};
    this._level = undefined;
    this._transactionName = undefined;
    this._fingerprint = undefined;
    this._requestSession = undefined;
    this._span = undefined;
    this._session = undefined;
    this._notifyScopeListeners();
    this._attachments = [];
    return this;
  }

  /**
   * @inheritDoc
   */
   addBreadcrumb(breadcrumb, maxBreadcrumbs) {
    var maxCrumbs = typeof maxBreadcrumbs === 'number' ? Math.min(maxBreadcrumbs, MAX_BREADCRUMBS) : MAX_BREADCRUMBS;

    // No data has been changed, so don't notify scope listeners
    if (maxCrumbs <= 0) {
      return this;
    }

    var mergedBreadcrumb = {
      timestamp: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.dateTimestampInSeconds)(),
      ...breadcrumb,
    };
    this._breadcrumbs = [...this._breadcrumbs, mergedBreadcrumb].slice(-maxCrumbs);
    this._notifyScopeListeners();

    return this;
  }

  /**
   * @inheritDoc
   */
   clearBreadcrumbs() {
    this._breadcrumbs = [];
    this._notifyScopeListeners();
    return this;
  }

  /**
   * @inheritDoc
   */
   addAttachment(attachment) {
    this._attachments.push(attachment);
    return this;
  }

  /**
   * @inheritDoc
   */
   getAttachments() {
    return this._attachments;
  }

  /**
   * @inheritDoc
   */
   clearAttachments() {
    this._attachments = [];
    return this;
  }

  /**
   * Applies data from the scope to the event and runs all event processors on it.
   *
   * @param event Event
   * @param hint Object containing additional information about the original exception, for use by the event processors.
   * @hidden
   */
   applyToEvent(event, hint = {}) {
    if (this._extra && Object.keys(this._extra).length) {
      event.extra = { ...this._extra, ...event.extra };
    }
    if (this._tags && Object.keys(this._tags).length) {
      event.tags = { ...this._tags, ...event.tags };
    }
    if (this._user && Object.keys(this._user).length) {
      event.user = { ...this._user, ...event.user };
    }
    if (this._contexts && Object.keys(this._contexts).length) {
      event.contexts = { ...this._contexts, ...event.contexts };
    }
    if (this._level) {
      event.level = this._level;
    }
    if (this._transactionName) {
      event.transaction = this._transactionName;
    }

    // We want to set the trace context for normal events only if there isn't already
    // a trace context on the event. There is a product feature in place where we link
    // errors with transaction and it relies on that.
    if (this._span) {
      event.contexts = { trace: this._span.getTraceContext(), ...event.contexts };
      var transactionName = this._span.transaction && this._span.transaction.name;
      if (transactionName) {
        event.tags = { transaction: transactionName, ...event.tags };
      }
    }

    this._applyFingerprint(event);

    event.breadcrumbs = [...(event.breadcrumbs || []), ...this._breadcrumbs];
    event.breadcrumbs = event.breadcrumbs.length > 0 ? event.breadcrumbs : undefined;

    event.sdkProcessingMetadata = { ...event.sdkProcessingMetadata, ...this._sdkProcessingMetadata };

    return this._notifyEventProcessors([...getGlobalEventProcessors(), ...this._eventProcessors], event, hint);
  }

  /**
   * Add data which will be accessible during event processing but won't get sent to Sentry
   */
   setSDKProcessingMetadata(newData) {
    this._sdkProcessingMetadata = { ...this._sdkProcessingMetadata, ...newData };

    return this;
  }

  /**
   * This will be called after {@link applyToEvent} is finished.
   */
   _notifyEventProcessors(
    processors,
    event,
    hint,
    index = 0,
  ) {
    return new _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.SyncPromise((resolve, reject) => {
      var processor = processors[index];
      if (event === null || typeof processor !== 'function') {
        resolve(event);
      } else {
        var result = processor({ ...event }, hint) ;

        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
          processor.id &&
          result === null &&
          _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.log(`Event processor "${processor.id}" dropped event`);

        if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.isThenable)(result)) {
          void result
            .then(final => this._notifyEventProcessors(processors, final, hint, index + 1).then(resolve))
            .then(null, reject);
        } else {
          void this._notifyEventProcessors(processors, result, hint, index + 1)
            .then(resolve)
            .then(null, reject);
        }
      }
    });
  }

  /**
   * This will be called on every set call.
   */
   _notifyScopeListeners() {
    // We need this check for this._notifyingListeners to be able to work on scope during updates
    // If this check is not here we'll produce endless recursion when something is done with the scope
    // during the callback.
    if (!this._notifyingListeners) {
      this._notifyingListeners = true;
      this._scopeListeners.forEach(callback => {
        callback(this);
      });
      this._notifyingListeners = false;
    }
  }

  /**
   * Applies fingerprint from the scope to the event if there's one,
   * uses message if there's one instead or get rid of empty fingerprint
   */
   _applyFingerprint(event) {
    // Make sure it's an array first and we actually have something in place
    event.fingerprint = event.fingerprint ? (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.arrayify)(event.fingerprint) : [];

    // If we have something on the scope, then merge it with event
    if (this._fingerprint) {
      event.fingerprint = event.fingerprint.concat(this._fingerprint);
    }

    // If we have no data at all, remove empty array default
    if (event.fingerprint && !event.fingerprint.length) {
      delete event.fingerprint;
    }
  }
}

/**
 * Returns the global event processors.
 */
function getGlobalEventProcessors() {
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.getGlobalSingleton)('globalEventProcessors', () => []);
}

/**
 * Add a EventProcessor to be kept globally.
 * @param callback EventProcessor to add
 */
function addGlobalEventProcessor(callback) {
  getGlobalEventProcessors().push(callback);
}


//# sourceMappingURL=scope.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/hub/esm/session.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "closeSession": () => (/* binding */ closeSession),
/* harmony export */   "makeSession": () => (/* binding */ makeSession),
/* harmony export */   "updateSession": () => (/* binding */ updateSession)
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/time.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/misc.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/object.js");


/**
 * Creates a new `Session` object by setting certain default parameters. If optional @param context
 * is passed, the passed properties are applied to the session object.
 *
 * @param context (optional) additional properties to be applied to the returned session object
 *
 * @returns a new `Session` object
 */
function makeSession(context) {
  // Both timestamp and started are in seconds since the UNIX epoch.
  var startingTime = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.timestampInSeconds)();

  var session = {
    sid: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.uuid4)(),
    init: true,
    timestamp: startingTime,
    started: startingTime,
    duration: 0,
    status: 'ok',
    errors: 0,
    ignoreDuration: false,
    toJSON: () => sessionToJSON(session),
  };

  if (context) {
    updateSession(session, context);
  }

  return session;
}

/**
 * Updates a session object with the properties passed in the context.
 *
 * Note that this function mutates the passed object and returns void.
 * (Had to do this instead of returning a new and updated session because closing and sending a session
 * makes an update to the session after it was passed to the sending logic.
 * @see BaseClient.captureSession )
 *
 * @param session the `Session` to update
 * @param context the `SessionContext` holding the properties that should be updated in @param session
 */
function updateSession(session, context = {}) {
  if (context.user) {
    if (!session.ipAddress && context.user.ip_address) {
      session.ipAddress = context.user.ip_address;
    }

    if (!session.did && !context.did) {
      session.did = context.user.id || context.user.email || context.user.username;
    }
  }

  session.timestamp = context.timestamp || (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.timestampInSeconds)();

  if (context.ignoreDuration) {
    session.ignoreDuration = context.ignoreDuration;
  }
  if (context.sid) {
    // Good enough uuid validation. — Kamil
    session.sid = context.sid.length === 32 ? context.sid : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.uuid4)();
  }
  if (context.init !== undefined) {
    session.init = context.init;
  }
  if (!session.did && context.did) {
    session.did = `${context.did}`;
  }
  if (typeof context.started === 'number') {
    session.started = context.started;
  }
  if (session.ignoreDuration) {
    session.duration = undefined;
  } else if (typeof context.duration === 'number') {
    session.duration = context.duration;
  } else {
    var duration = session.timestamp - session.started;
    session.duration = duration >= 0 ? duration : 0;
  }
  if (context.release) {
    session.release = context.release;
  }
  if (context.environment) {
    session.environment = context.environment;
  }
  if (!session.ipAddress && context.ipAddress) {
    session.ipAddress = context.ipAddress;
  }
  if (!session.userAgent && context.userAgent) {
    session.userAgent = context.userAgent;
  }
  if (typeof context.errors === 'number') {
    session.errors = context.errors;
  }
  if (context.status) {
    session.status = context.status;
  }
}

/**
 * Closes a session by setting its status and updating the session object with it.
 * Internally calls `updateSession` to update the passed session object.
 *
 * Note that this function mutates the passed session (@see updateSession for explanation).
 *
 * @param session the `Session` object to be closed
 * @param status the `SessionStatus` with which the session was closed. If you don't pass a status,
 *               this function will keep the previously set status, unless it was `'ok'` in which case
 *               it is changed to `'exited'`.
 */
function closeSession(session, status) {
  let context = {};
  if (status) {
    context = { status };
  } else if (session.status === 'ok') {
    context = { status: 'exited' };
  }

  updateSession(session, context);
}

/**
 * Serializes a passed session object to a JSON object with a slightly different structure.
 * This is necessary because the Sentry backend requires a slightly different schema of a session
 * than the one the JS SDKs use internally.
 *
 * @param session the session to be converted
 *
 * @returns a JSON object of the passed session
 */
function sessionToJSON(session) {
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.dropUndefinedKeys)({
    sid: `${session.sid}`,
    init: session.init,
    // Make sure that sec is converted to ms for date constructor
    started: new Date(session.started * 1000).toISOString(),
    timestamp: new Date(session.timestamp * 1000).toISOString(),
    status: session.status,
    errors: session.errors,
    did: typeof session.did === 'number' || typeof session.did === 'string' ? `${session.did}` : undefined,
    duration: session.duration,
    attrs: {
      release: session.release,
      environment: session.environment,
      ip_address: session.ipAddress,
      user_agent: session.userAgent,
    },
  });
}


//# sourceMappingURL=session.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/baggage.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BAGGAGE_HEADER_NAME": () => (/* binding */ BAGGAGE_HEADER_NAME),
/* harmony export */   "MAX_BAGGAGE_STRING_LENGTH": () => (/* binding */ MAX_BAGGAGE_STRING_LENGTH),
/* harmony export */   "SENTRY_BAGGAGE_KEY_PREFIX": () => (/* binding */ SENTRY_BAGGAGE_KEY_PREFIX),
/* harmony export */   "SENTRY_BAGGAGE_KEY_PREFIX_REGEX": () => (/* binding */ SENTRY_BAGGAGE_KEY_PREFIX_REGEX),
/* harmony export */   "baggageHeaderToDynamicSamplingContext": () => (/* binding */ baggageHeaderToDynamicSamplingContext),
/* harmony export */   "dynamicSamplingContextToSentryBaggageHeader": () => (/* binding */ dynamicSamplingContextToSentryBaggageHeader)
/* harmony export */ });
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/is.js");
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");



var BAGGAGE_HEADER_NAME = 'baggage';

var SENTRY_BAGGAGE_KEY_PREFIX = 'sentry-';

var SENTRY_BAGGAGE_KEY_PREFIX_REGEX = /^sentry-/;

/**
 * Max length of a serialized baggage string
 *
 * https://www.w3.org/TR/baggage/#limits
 */
var MAX_BAGGAGE_STRING_LENGTH = 8192;

/**
 * Takes a baggage header and turns it into Dynamic Sampling Context, by extracting all the "sentry-" prefixed values
 * from it.
 *
 * @param baggageHeader A very bread definition of a baggage header as it might appear in various frameworks.
 * @returns The Dynamic Sampling Context that was found on `baggageHeader`, if there was any, `undefined` otherwise.
 */
function baggageHeaderToDynamicSamplingContext(
  // Very liberal definition of what any incoming header might look like
  baggageHeader,
) {
  if (!(0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isString)(baggageHeader) && !Array.isArray(baggageHeader)) {
    return undefined;
  }

  // Intermediary object to store baggage key value pairs of incoming baggage headers on.
  // It is later used to read Sentry-DSC-values from.
  let baggageObject = {};

  if (Array.isArray(baggageHeader)) {
    // Combine all baggage headers into one object containing the baggage values so we can later read the Sentry-DSC-values from it
    baggageObject = baggageHeader.reduce((acc, curr) => {
      var currBaggageObject = baggageHeaderToObject(curr);
      return {
        ...acc,
        ...currBaggageObject,
      };
    }, {});
  } else {
    // Return undefined if baggage header is an empty string (technically an empty baggage header is not spec conform but
    // this is how we choose to handle it)
    if (!baggageHeader) {
      return undefined;
    }

    baggageObject = baggageHeaderToObject(baggageHeader);
  }

  // Read all "sentry-" prefixed values out of the baggage object and put it onto a dynamic sampling context object.
  var dynamicSamplingContext = Object.entries(baggageObject).reduce((acc, [key, value]) => {
    if (key.match(SENTRY_BAGGAGE_KEY_PREFIX_REGEX)) {
      var nonPrefixedKey = key.slice(SENTRY_BAGGAGE_KEY_PREFIX.length);
      acc[nonPrefixedKey] = value;
    }
    return acc;
  }, {});

  // Only return a dynamic sampling context object if there are keys in it.
  // A keyless object means there were no sentry values on the header, which means that there is no DSC.
  if (Object.keys(dynamicSamplingContext).length > 0) {
    return dynamicSamplingContext ;
  } else {
    return undefined;
  }
}

/**
 * Turns a Dynamic Sampling Object into a baggage header by prefixing all the keys on the object with "sentry-".
 *
 * @param dynamicSamplingContext The Dynamic Sampling Context to turn into a header. For convenience and compatibility
 * with the `getDynamicSamplingContext` method on the Transaction class ,this argument can also be `undefined`. If it is
 * `undefined` the function will return `undefined`.
 * @returns a baggage header, created from `dynamicSamplingContext`, or `undefined` either if `dynamicSamplingContext`
 * was `undefined`, or if `dynamicSamplingContext` didn't contain any values.
 */
function dynamicSamplingContextToSentryBaggageHeader(
  // this also takes undefined for convenience and bundle size in other places
  dynamicSamplingContext,
) {
  // Prefix all DSC keys with "sentry-" and put them into a new object
  var sentryPrefixedDSC = Object.entries(dynamicSamplingContext).reduce(
    (acc, [dscKey, dscValue]) => {
      if (dscValue) {
        acc[`${SENTRY_BAGGAGE_KEY_PREFIX}${dscKey}`] = dscValue;
      }
      return acc;
    },
    {},
  );

  return objectToBaggageHeader(sentryPrefixedDSC);
}

/**
 * Will parse a baggage header, which is a simple key-value map, into a flat object.
 *
 * @param baggageHeader The baggage header to parse.
 * @returns a flat object containing all the key-value pairs from `baggageHeader`.
 */
function baggageHeaderToObject(baggageHeader) {
  return baggageHeader
    .split(',')
    .map(baggageEntry => baggageEntry.split('=').map(keyOrValue => decodeURIComponent(keyOrValue.trim())))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
}

/**
 * Turns a flat object (key-value pairs) into a baggage header, which is also just key-value pairs.
 *
 * @param object The object to turn into a baggage header.
 * @returns a baggage header string, or `undefined` if the object didn't have any values, since an empty baggage header
 * is not spec compliant.
 */
function objectToBaggageHeader(object) {
  if (Object.keys(object).length === 0) {
    // An empty baggage header is not spec compliant: We return undefined.
    return undefined;
  }

  return Object.entries(object).reduce((baggageHeader, [objectKey, objectValue], currentIndex) => {
    var baggageEntry = `${encodeURIComponent(objectKey)}=${encodeURIComponent(objectValue)}`;
    var newBaggageHeader = currentIndex === 0 ? baggageEntry : `${baggageHeader},${baggageEntry}`;
    if (newBaggageHeader.length > MAX_BAGGAGE_STRING_LENGTH) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
        _logger_js__WEBPACK_IMPORTED_MODULE_1__.logger.warn(
          `Not adding key: ${objectKey} with val: ${objectValue} to baggage header due to exceeding baggage size limits.`,
        );
      return baggageHeader;
    } else {
      return newBaggageHeader;
    }
  }, '');
}


//# sourceMappingURL=baggage.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/browser.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getDomElement": () => (/* binding */ getDomElement),
/* harmony export */   "getLocationHref": () => (/* binding */ getLocationHref),
/* harmony export */   "htmlTreeAsString": () => (/* binding */ htmlTreeAsString)
/* harmony export */ });
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/global.js");
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/is.js");



/**
 * Given a child DOM element, returns a query-selector statement describing that
 * and its ancestors
 * e.g. [HTMLElement] => body > div > input#foo.btn[name=baz]
 * @returns generated DOM path
 */
function htmlTreeAsString(elem, keyAttrs) {
  

  // try/catch both:
  // - accessing event.target (see getsentry/raven-js#838, #768)
  // - `htmlTreeAsString` because it's complex, and just accessing the DOM incorrectly
  // - can throw an exception in some circumstances.
  try {
    let currentElem = elem ;
    var MAX_TRAVERSE_HEIGHT = 5;
    var MAX_OUTPUT_LEN = 80;
    var out = [];
    let height = 0;
    let len = 0;
    var separator = ' > ';
    var sepLength = separator.length;
    let nextStr;

        while (currentElem && height++ < MAX_TRAVERSE_HEIGHT) {
      nextStr = _htmlElementAsString(currentElem, keyAttrs);
      // bail out if
      // - nextStr is the 'html' element
      // - the length of the string that would be created exceeds MAX_OUTPUT_LEN
      //   (ignore this limit if we are on the first iteration)
      if (nextStr === 'html' || (height > 1 && len + out.length * sepLength + nextStr.length >= MAX_OUTPUT_LEN)) {
        break;
      }

      out.push(nextStr);

      len += nextStr.length;
      currentElem = currentElem.parentNode;
    }

    return out.reverse().join(separator);
  } catch (_oO) {
    return '<unknown>';
  }
}

/**
 * Returns a simple, query-selector representation of a DOM element
 * e.g. [HTMLElement] => input#foo.btn[name=baz]
 * @returns generated DOM path
 */
function _htmlElementAsString(el, keyAttrs) {
  var elem = el 

;

  var out = [];
  let className;
  let classes;
  let key;
  let attr;
  let i;

  if (!elem || !elem.tagName) {
    return '';
  }

  out.push(elem.tagName.toLowerCase());

  // Pairs of attribute keys defined in `serializeAttribute` and their values on element.
  var keyAttrPairs =
    keyAttrs && keyAttrs.length
      ? keyAttrs.filter(keyAttr => elem.getAttribute(keyAttr)).map(keyAttr => [keyAttr, elem.getAttribute(keyAttr)])
      : null;

  if (keyAttrPairs && keyAttrPairs.length) {
    keyAttrPairs.forEach(keyAttrPair => {
      out.push(`[${keyAttrPair[0]}="${keyAttrPair[1]}"]`);
    });
  } else {
    if (elem.id) {
      out.push(`#${elem.id}`);
    }

        className = elem.className;
    if (className && (0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isString)(className)) {
      classes = className.split(/\s+/);
      for (i = 0; i < classes.length; i++) {
        out.push(`.${classes[i]}`);
      }
    }
  }
  var allowedAttrs = ['type', 'name', 'title', 'alt'];
  for (i = 0; i < allowedAttrs.length; i++) {
    key = allowedAttrs[i];
    attr = elem.getAttribute(key);
    if (attr) {
      out.push(`[${key}="${attr}"]`);
    }
  }
  return out.join('');
}

/**
 * A safe form of location.href
 */
function getLocationHref() {
  var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_1__.getGlobalObject)();
  try {
    return global.document.location.href;
  } catch (oO) {
    return '';
  }
}

/**
 * Gets a DOM element by using document.querySelector.
 *
 * This wrapper will first check for the existance of the function before
 * actually calling it so that we don't have to take care of this check,
 * every time we want to access the DOM.
 *
 * Reason: DOM/querySelector is not available in all environments.
 *
 * We have to cast to any because utils can be consumed by a variety of environments,
 * and we don't want to break TS users. If you know what element will be selected by
 * `document.querySelector`, specify it as part of the generic call. For example,
 * `var element = getDomElement<Element>('selector');`
 *
 * @param selector the selector string passed on to document.querySelector
 */
function getDomElement(selector) {
  var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_1__.getGlobalObject)();
  if (global.document && global.document.querySelector) {
    return global.document.querySelector(selector) ;
  }
  return null;
}


//# sourceMappingURL=browser.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/buildPolyfills/_nullishCoalesce.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_nullishCoalesce": () => (/* binding */ _nullishCoalesce)
/* harmony export */ });
/**
 * Polyfill for the nullish coalescing operator (`??`).
 *
 * Note that the RHS is wrapped in a function so that if it's a computed value, that evaluation won't happen unless the
 * LHS evaluates to a nullish value, to mimic the operator's short-circuiting behavior.
 *
 * Adapted from Sucrase (https://github.com/alangpierce/sucrase)
 *
 * @param lhs The value of the expression to the left of the `??`
 * @param rhsFn A function returning the value of the expression to the right of the `??`
 * @returns The LHS value, unless it's `null` or `undefined`, in which case, the RHS value
 */
function _nullishCoalesce(lhs, rhsFn) {
  // by checking for loose equality to `null`, we catch both `null` and `undefined`
  return lhs != null ? lhs : rhsFn();
}

// Sucrase version:
// function _nullishCoalesce(lhs, rhsFn) {
//   if (lhs != null) {
//     return lhs;
//   } else {
//     return rhsFn();
//   }
// }


//# sourceMappingURL=_nullishCoalesce.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_optionalChain": () => (/* binding */ _optionalChain)
/* harmony export */ });
/**
 * Polyfill for the optional chain operator, `?.`, given previous conversion of the expression into an array of values,
 * descriptors, and functions.
 *
 * Adapted from Sucrase (https://github.com/alangpierce/sucrase)
 * See https://github.com/alangpierce/sucrase/blob/265887868966917f3b924ce38dfad01fbab1329f/src/transformers/OptionalChainingNullishTransformer.ts#L15
 *
 * @param ops Array result of expression conversion
 * @returns The value of the expression
 */
function _optionalChain(ops) {
  let lastAccessLHS = undefined;
  let value = ops[0];
  let i = 1;
  while (i < ops.length) {
    var op = ops[i] ;
    var fn = ops[i + 1] ;
    i += 2;
    // by checking for loose equality to `null`, we catch both `null` and `undefined`
    if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
      // really we're meaning to return `undefined` as an actual value here, but it saves bytes not to write it
      return;
    }
    if (op === 'access' || op === 'optionalAccess') {
      lastAccessLHS = value;
      value = fn(value);
    } else if (op === 'call' || op === 'optionalCall') {
      value = fn((...args) => (value ).call(lastAccessLHS, ...args));
      lastAccessLHS = undefined;
    }
  }
  return value;
}

// Sucrase version
// function _optionalChain(ops) {
//   let lastAccessLHS = undefined;
//   let value = ops[0];
//   let i = 1;
//   while (i < ops.length) {
//     var op = ops[i];
//     var fn = ops[i + 1];
//     i += 2;
//     if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
//       return undefined;
//     }
//     if (op === 'access' || op === 'optionalAccess') {
//       lastAccessLHS = value;
//       value = fn(value);
//     } else if (op === 'call' || op === 'optionalCall') {
//       value = fn((...args) => value.call(lastAccessLHS, ...args));
//       lastAccessLHS = undefined;
//     }
//   }
//   return value;
// }


//# sourceMappingURL=_optionalChain.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/env.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isBrowserBundle": () => (/* binding */ isBrowserBundle)
/* harmony export */ });
/*
 * This module exists for optimizations in the build process through rollup and terser.  We define some global
 * constants, which can be overridden during build. By guarding certain pieces of code with functions that return these
 * constants, we can control whether or not they appear in the final bundle. (Any code guarded by a false condition will
 * never run, and will hence be dropped during treeshaking.) The two primary uses for this are stripping out calls to
 * `logger` and preventing node-related code from appearing in browser bundles.
 *
 * Attention:
 * This file should not be used to define constants/flags that are intended to be used for tree-shaking conducted by
 * users. These fags should live in their respective packages, as we identified user tooling (specifically webpack)
 * having issues tree-shaking these constants across package boundaries.
 * An example for this is the __SENTRY_DEBUG__ constant. It is declared in each package individually because we want
 * users to be able to shake away expressions that it guards.
 */

/**
 * Figures out if we're building a browser bundle.
 *
 * @returns true if this is a browser bundle build.
 */
function isBrowserBundle() {
  return typeof __SENTRY_BROWSER_BUNDLE__ !== 'undefined' && !!__SENTRY_BROWSER_BUNDLE__;
}


//# sourceMappingURL=env.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/global.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getGlobalObject": () => (/* binding */ getGlobalObject),
/* harmony export */   "getGlobalSingleton": () => (/* binding */ getGlobalSingleton)
/* harmony export */ });
/* harmony import */ var _node_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/node.js");


/** Internal */

var fallbackGlobalObject = {};

/**
 * Safely get global scope object
 *
 * @returns Global scope object
 */
function getGlobalObject() {
  return (
    (0,_node_js__WEBPACK_IMPORTED_MODULE_0__.isNodeEnv)()
      ? global
      : typeof window !== 'undefined'       ? window       : typeof self !== 'undefined'
      ? self
      : fallbackGlobalObject
  ) ;
}

/**
 * Returns a global singleton contained in the global `__SENTRY__` object.
 *
 * If the singleton doesn't already exist in `__SENTRY__`, it will be created using the given factory
 * function and added to the `__SENTRY__` object.
 *
 * @param name name of the global singleton on __SENTRY__
 * @param creator creator Factory function to create the singleton if it doesn't already exist on `__SENTRY__`
 * @param obj (Optional) The global object on which to look for `__SENTRY__`, if not `getGlobalObject`'s return value
 * @returns the singleton
 */
function getGlobalSingleton(name, creator, obj) {
  var global = (obj || getGlobalObject()) ;
  var __SENTRY__ = (global.__SENTRY__ = global.__SENTRY__ || {});
  var singleton = __SENTRY__[name] || (__SENTRY__[name] = creator());
  return singleton;
}


//# sourceMappingURL=global.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/instrument.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addInstrumentationHandler": () => (/* binding */ addInstrumentationHandler)
/* harmony export */ });
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/global.js");
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/is.js");
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _object_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/object.js");
/* harmony import */ var _stacktrace_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/stacktrace.js");
/* harmony import */ var _supports_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/supports.js");







var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();

/**
 * Instrument native APIs to call handlers that can be used to create breadcrumbs, APM spans etc.
 *  - Console API
 *  - Fetch API
 *  - XHR API
 *  - History API
 *  - DOM API (click/typing)
 *  - Error API
 *  - UnhandledRejection API
 */

var handlers = {};
var instrumented = {};

/** Instruments given API */
function instrument(type) {
  if (instrumented[type]) {
    return;
  }

  instrumented[type] = true;

  switch (type) {
    case 'console':
      instrumentConsole();
      break;
    case 'dom':
      instrumentDOM();
      break;
    case 'xhr':
      instrumentXHR();
      break;
    case 'fetch':
      instrumentFetch();
      break;
    case 'history':
      instrumentHistory();
      break;
    case 'error':
      instrumentError();
      break;
    case 'unhandledrejection':
      instrumentUnhandledRejection();
      break;
    default:
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _logger_js__WEBPACK_IMPORTED_MODULE_1__.logger.warn('unknown instrumentation type:', type);
      return;
  }
}

/**
 * Add handler that will be called when given type of instrumentation triggers.
 * Use at your own risk, this might break without changelog notice, only used internally.
 * @hidden
 */
function addInstrumentationHandler(type, callback) {
  handlers[type] = handlers[type] || [];
  (handlers[type] ).push(callback);
  instrument(type);
}

/** JSDoc */
function triggerHandlers(type, data) {
  if (!type || !handlers[type]) {
    return;
  }

  for (var handler of handlers[type] || []) {
    try {
      handler(data);
    } catch (e) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
        _logger_js__WEBPACK_IMPORTED_MODULE_1__.logger.error(
          `Error while triggering instrumentation handler.\nType: ${type}\nName: ${(0,_stacktrace_js__WEBPACK_IMPORTED_MODULE_2__.getFunctionName)(handler)}\nError:`,
          e,
        );
    }
  }
}

/** JSDoc */
function instrumentConsole() {
  if (!('console' in global)) {
    return;
  }

  _logger_js__WEBPACK_IMPORTED_MODULE_1__.CONSOLE_LEVELS.forEach(function (level) {
    if (!(level in global.console)) {
      return;
    }

    (0,_object_js__WEBPACK_IMPORTED_MODULE_3__.fill)(global.console, level, function (originalConsoleMethod) {
      return function (...args) {
        triggerHandlers('console', { args, level });

        // this fails for some browsers. :(
        if (originalConsoleMethod) {
          originalConsoleMethod.apply(global.console, args);
        }
      };
    });
  });
}

/** JSDoc */
function instrumentFetch() {
  if (!(0,_supports_js__WEBPACK_IMPORTED_MODULE_4__.supportsNativeFetch)()) {
    return;
  }

  (0,_object_js__WEBPACK_IMPORTED_MODULE_3__.fill)(global, 'fetch', function (originalFetch) {
    return function (...args) {
      var handlerData = {
        args,
        fetchData: {
          method: getFetchMethod(args),
          url: getFetchUrl(args),
        },
        startTimestamp: Date.now(),
      };

      triggerHandlers('fetch', {
        ...handlerData,
      });

            return originalFetch.apply(global, args).then(
        (response) => {
          triggerHandlers('fetch', {
            ...handlerData,
            endTimestamp: Date.now(),
            response,
          });
          return response;
        },
        (error) => {
          triggerHandlers('fetch', {
            ...handlerData,
            endTimestamp: Date.now(),
            error,
          });
          // NOTE: If you are a Sentry user, and you are seeing this stack frame,
          //       it means the sentry.javascript SDK caught an error invoking your application code.
          //       This is expected behavior and NOT indicative of a bug with sentry.javascript.
          throw error;
        },
      );
    };
  });
}

/** Extract `method` from fetch call arguments */
function getFetchMethod(fetchArgs = []) {
  if ('Request' in global && (0,_is_js__WEBPACK_IMPORTED_MODULE_5__.isInstanceOf)(fetchArgs[0], Request) && fetchArgs[0].method) {
    return String(fetchArgs[0].method).toUpperCase();
  }
  if (fetchArgs[1] && fetchArgs[1].method) {
    return String(fetchArgs[1].method).toUpperCase();
  }
  return 'GET';
}

/** Extract `url` from fetch call arguments */
function getFetchUrl(fetchArgs = []) {
  if (typeof fetchArgs[0] === 'string') {
    return fetchArgs[0];
  }
  if ('Request' in global && (0,_is_js__WEBPACK_IMPORTED_MODULE_5__.isInstanceOf)(fetchArgs[0], Request)) {
    return fetchArgs[0].url;
  }
  return String(fetchArgs[0]);
}

/** JSDoc */
function instrumentXHR() {
  if (!('XMLHttpRequest' in global)) {
    return;
  }

  var xhrproto = XMLHttpRequest.prototype;

  (0,_object_js__WEBPACK_IMPORTED_MODULE_3__.fill)(xhrproto, 'open', function (originalOpen) {
    return function ( ...args) {
            var xhr = this;
      var url = args[1];
      var xhrInfo = (xhr.__sentry_xhr__ = {
                method: (0,_is_js__WEBPACK_IMPORTED_MODULE_5__.isString)(args[0]) ? args[0].toUpperCase() : args[0],
        url: args[1],
      });

      // if Sentry key appears in URL, don't capture it as a request
            if ((0,_is_js__WEBPACK_IMPORTED_MODULE_5__.isString)(url) && xhrInfo.method === 'POST' && url.match(/sentry_key/)) {
        xhr.__sentry_own_request__ = true;
      }

      var onreadystatechangeHandler = function () {
        if (xhr.readyState === 4) {
          try {
            // touching statusCode in some platforms throws
            // an exception
            xhrInfo.status_code = xhr.status;
          } catch (e) {
            /* do nothing */
          }

          triggerHandlers('xhr', {
            args,
            endTimestamp: Date.now(),
            startTimestamp: Date.now(),
            xhr,
          });
        }
      };

      if ('onreadystatechange' in xhr && typeof xhr.onreadystatechange === 'function') {
        (0,_object_js__WEBPACK_IMPORTED_MODULE_3__.fill)(xhr, 'onreadystatechange', function (original) {
          return function (...readyStateArgs) {
            onreadystatechangeHandler();
            return original.apply(xhr, readyStateArgs);
          };
        });
      } else {
        xhr.addEventListener('readystatechange', onreadystatechangeHandler);
      }

      return originalOpen.apply(xhr, args);
    };
  });

  (0,_object_js__WEBPACK_IMPORTED_MODULE_3__.fill)(xhrproto, 'send', function (originalSend) {
    return function ( ...args) {
      if (this.__sentry_xhr__ && args[0] !== undefined) {
        this.__sentry_xhr__.body = args[0];
      }

      triggerHandlers('xhr', {
        args,
        startTimestamp: Date.now(),
        xhr: this,
      });

      return originalSend.apply(this, args);
    };
  });
}

let lastHref;

/** JSDoc */
function instrumentHistory() {
  if (!(0,_supports_js__WEBPACK_IMPORTED_MODULE_4__.supportsHistory)()) {
    return;
  }

  var oldOnPopState = global.onpopstate;
  global.onpopstate = function ( ...args) {
    var to = global.location.href;
    // keep track of the current URL state, as we always receive only the updated state
    var from = lastHref;
    lastHref = to;
    triggerHandlers('history', {
      from,
      to,
    });
    if (oldOnPopState) {
      // Apparently this can throw in Firefox when incorrectly implemented plugin is installed.
      // https://github.com/getsentry/sentry-javascript/issues/3344
      // https://github.com/bugsnag/bugsnag-js/issues/469
      try {
        return oldOnPopState.apply(this, args);
      } catch (_oO) {
        // no-empty
      }
    }
  };

  /** @hidden */
  function historyReplacementFunction(originalHistoryFunction) {
    return function ( ...args) {
      var url = args.length > 2 ? args[2] : undefined;
      if (url) {
        // coerce to string (this is what pushState does)
        var from = lastHref;
        var to = String(url);
        // keep track of the current URL state, as we always receive only the updated state
        lastHref = to;
        triggerHandlers('history', {
          from,
          to,
        });
      }
      return originalHistoryFunction.apply(this, args);
    };
  }

  (0,_object_js__WEBPACK_IMPORTED_MODULE_3__.fill)(global.history, 'pushState', historyReplacementFunction);
  (0,_object_js__WEBPACK_IMPORTED_MODULE_3__.fill)(global.history, 'replaceState', historyReplacementFunction);
}

var debounceDuration = 1000;
let debounceTimerID;
let lastCapturedEvent;

/**
 * Decide whether the current event should finish the debounce of previously captured one.
 * @param previous previously captured event
 * @param current event to be captured
 */
function shouldShortcircuitPreviousDebounce(previous, current) {
  // If there was no previous event, it should always be swapped for the new one.
  if (!previous) {
    return true;
  }

  // If both events have different type, then user definitely performed two separate actions. e.g. click + keypress.
  if (previous.type !== current.type) {
    return true;
  }

  try {
    // If both events have the same type, it's still possible that actions were performed on different targets.
    // e.g. 2 clicks on different buttons.
    if (previous.target !== current.target) {
      return true;
    }
  } catch (e) {
    // just accessing `target` property can throw an exception in some rare circumstances
    // see: https://github.com/getsentry/sentry-javascript/issues/838
  }

  // If both events have the same type _and_ same `target` (an element which triggered an event, _not necessarily_
  // to which an event listener was attached), we treat them as the same action, as we want to capture
  // only one breadcrumb. e.g. multiple clicks on the same button, or typing inside a user input box.
  return false;
}

/**
 * Decide whether an event should be captured.
 * @param event event to be captured
 */
function shouldSkipDOMEvent(event) {
  // We are only interested in filtering `keypress` events for now.
  if (event.type !== 'keypress') {
    return false;
  }

  try {
    var target = event.target ;

    if (!target || !target.tagName) {
      return true;
    }

    // Only consider keypress events on actual input elements. This will disregard keypresses targeting body
    // e.g.tabbing through elements, hotkeys, etc.
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return false;
    }
  } catch (e) {
    // just accessing `target` property can throw an exception in some rare circumstances
    // see: https://github.com/getsentry/sentry-javascript/issues/838
  }

  return true;
}

/**
 * Wraps addEventListener to capture UI breadcrumbs
 * @param handler function that will be triggered
 * @param globalListener indicates whether event was captured by the global event listener
 * @returns wrapped breadcrumb events handler
 * @hidden
 */
function makeDOMEventHandler(handler, globalListener = false) {
  return (event) => {
    // It's possible this handler might trigger multiple times for the same
    // event (e.g. event propagation through node ancestors).
    // Ignore if we've already captured that event.
    if (!event || lastCapturedEvent === event) {
      return;
    }

    // We always want to skip _some_ events.
    if (shouldSkipDOMEvent(event)) {
      return;
    }

    var name = event.type === 'keypress' ? 'input' : event.type;

    // If there is no debounce timer, it means that we can safely capture the new event and store it for future comparisons.
    if (debounceTimerID === undefined) {
      handler({
        event: event,
        name,
        global: globalListener,
      });
      lastCapturedEvent = event;
    }
    // If there is a debounce awaiting, see if the new event is different enough to treat it as a unique one.
    // If that's the case, emit the previous event and store locally the newly-captured DOM event.
    else if (shouldShortcircuitPreviousDebounce(lastCapturedEvent, event)) {
      handler({
        event: event,
        name,
        global: globalListener,
      });
      lastCapturedEvent = event;
    }

    // Start a new debounce timer that will prevent us from capturing multiple events that should be grouped together.
    clearTimeout(debounceTimerID);
    debounceTimerID = global.setTimeout(() => {
      debounceTimerID = undefined;
    }, debounceDuration);
  };
}

/** JSDoc */
function instrumentDOM() {
  if (!('document' in global)) {
    return;
  }

  // Make it so that any click or keypress that is unhandled / bubbled up all the way to the document triggers our dom
  // handlers. (Normally we have only one, which captures a breadcrumb for each click or keypress.) Do this before
  // we instrument `addEventListener` so that we don't end up attaching this handler twice.
  var triggerDOMHandler = triggerHandlers.bind(null, 'dom');
  var globalDOMEventHandler = makeDOMEventHandler(triggerDOMHandler, true);
  global.document.addEventListener('click', globalDOMEventHandler, false);
  global.document.addEventListener('keypress', globalDOMEventHandler, false);

  // After hooking into click and keypress events bubbled up to `document`, we also hook into user-handled
  // clicks & keypresses, by adding an event listener of our own to any element to which they add a listener. That
  // way, whenever one of their handlers is triggered, ours will be, too. (This is needed because their handler
  // could potentially prevent the event from bubbling up to our global listeners. This way, our handler are still
  // guaranteed to fire at least once.)
  ['EventTarget', 'Node'].forEach((target) => {
        var proto = (global )[target] && (global )[target].prototype;
        if (!proto || !proto.hasOwnProperty || !proto.hasOwnProperty('addEventListener')) {
      return;
    }

    (0,_object_js__WEBPACK_IMPORTED_MODULE_3__.fill)(proto, 'addEventListener', function (originalAddEventListener) {
      return function (
        
        type,
        listener,
        options,
      ) {
        if (type === 'click' || type == 'keypress') {
          try {
            var el = this ;
            var handlers = (el.__sentry_instrumentation_handlers__ = el.__sentry_instrumentation_handlers__ || {});
            var handlerForType = (handlers[type] = handlers[type] || { refCount: 0 });

            if (!handlerForType.handler) {
              var handler = makeDOMEventHandler(triggerDOMHandler);
              handlerForType.handler = handler;
              originalAddEventListener.call(this, type, handler, options);
            }

            handlerForType.refCount += 1;
          } catch (e) {
            // Accessing dom properties is always fragile.
            // Also allows us to skip `addEventListenrs` calls with no proper `this` context.
          }
        }

        return originalAddEventListener.call(this, type, listener, options);
      };
    });

    (0,_object_js__WEBPACK_IMPORTED_MODULE_3__.fill)(
      proto,
      'removeEventListener',
      function (originalRemoveEventListener) {
        return function (
          
          type,
          listener,
          options,
        ) {
          if (type === 'click' || type == 'keypress') {
            try {
              var el = this ;
              var handlers = el.__sentry_instrumentation_handlers__ || {};
              var handlerForType = handlers[type];

              if (handlerForType) {
                handlerForType.refCount -= 1;
                // If there are no longer any custom handlers of the current type on this element, we can remove ours, too.
                if (handlerForType.refCount <= 0) {
                  originalRemoveEventListener.call(this, type, handlerForType.handler, options);
                  handlerForType.handler = undefined;
                  delete handlers[type];                 }

                // If there are no longer any custom handlers of any type on this element, cleanup everything.
                if (Object.keys(handlers).length === 0) {
                  delete el.__sentry_instrumentation_handlers__;
                }
              }
            } catch (e) {
              // Accessing dom properties is always fragile.
              // Also allows us to skip `addEventListenrs` calls with no proper `this` context.
            }
          }

          return originalRemoveEventListener.call(this, type, listener, options);
        };
      },
    );
  });
}

let _oldOnErrorHandler = null;
/** JSDoc */
function instrumentError() {
  _oldOnErrorHandler = global.onerror;

  global.onerror = function (msg, url, line, column, error) {
    triggerHandlers('error', {
      column,
      error,
      line,
      msg,
      url,
    });

    if (_oldOnErrorHandler) {
            return _oldOnErrorHandler.apply(this, arguments);
    }

    return false;
  };
}

let _oldOnUnhandledRejectionHandler = null;
/** JSDoc */
function instrumentUnhandledRejection() {
  _oldOnUnhandledRejectionHandler = global.onunhandledrejection;

  global.onunhandledrejection = function (e) {
    triggerHandlers('unhandledrejection', e);

    if (_oldOnUnhandledRejectionHandler) {
            return _oldOnUnhandledRejectionHandler.apply(this, arguments);
    }

    return true;
  };
}


//# sourceMappingURL=instrument.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/is.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isDOMError": () => (/* binding */ isDOMError),
/* harmony export */   "isDOMException": () => (/* binding */ isDOMException),
/* harmony export */   "isElement": () => (/* binding */ isElement),
/* harmony export */   "isError": () => (/* binding */ isError),
/* harmony export */   "isErrorEvent": () => (/* binding */ isErrorEvent),
/* harmony export */   "isEvent": () => (/* binding */ isEvent),
/* harmony export */   "isInstanceOf": () => (/* binding */ isInstanceOf),
/* harmony export */   "isNaN": () => (/* binding */ isNaN),
/* harmony export */   "isPlainObject": () => (/* binding */ isPlainObject),
/* harmony export */   "isPrimitive": () => (/* binding */ isPrimitive),
/* harmony export */   "isRegExp": () => (/* binding */ isRegExp),
/* harmony export */   "isString": () => (/* binding */ isString),
/* harmony export */   "isSyntheticEvent": () => (/* binding */ isSyntheticEvent),
/* harmony export */   "isThenable": () => (/* binding */ isThenable)
/* harmony export */ });
var objectToString = Object.prototype.toString;

/**
 * Checks whether given value's type is one of a few Error or Error-like
 * {@link isError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isError(wat) {
  switch (objectToString.call(wat)) {
    case '[object Error]':
    case '[object Exception]':
    case '[object DOMException]':
      return true;
    default:
      return isInstanceOf(wat, Error);
  }
}
/**
 * Checks whether given value is an instance of the given built-in class.
 *
 * @param wat The value to be checked
 * @param className
 * @returns A boolean representing the result.
 */
function isBuiltin(wat, className) {
  return objectToString.call(wat) === `[object ${className}]`;
}

/**
 * Checks whether given value's type is ErrorEvent
 * {@link isErrorEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isErrorEvent(wat) {
  return isBuiltin(wat, 'ErrorEvent');
}

/**
 * Checks whether given value's type is DOMError
 * {@link isDOMError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isDOMError(wat) {
  return isBuiltin(wat, 'DOMError');
}

/**
 * Checks whether given value's type is DOMException
 * {@link isDOMException}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isDOMException(wat) {
  return isBuiltin(wat, 'DOMException');
}

/**
 * Checks whether given value's type is a string
 * {@link isString}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isString(wat) {
  return isBuiltin(wat, 'String');
}

/**
 * Checks whether given value is a primitive (undefined, null, number, boolean, string, bigint, symbol)
 * {@link isPrimitive}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isPrimitive(wat) {
  return wat === null || (typeof wat !== 'object' && typeof wat !== 'function');
}

/**
 * Checks whether given value's type is an object literal
 * {@link isPlainObject}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isPlainObject(wat) {
  return isBuiltin(wat, 'Object');
}

/**
 * Checks whether given value's type is an Event instance
 * {@link isEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isEvent(wat) {
  return typeof Event !== 'undefined' && isInstanceOf(wat, Event);
}

/**
 * Checks whether given value's type is an Element instance
 * {@link isElement}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isElement(wat) {
  return typeof Element !== 'undefined' && isInstanceOf(wat, Element);
}

/**
 * Checks whether given value's type is an regexp
 * {@link isRegExp}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isRegExp(wat) {
  return isBuiltin(wat, 'RegExp');
}

/**
 * Checks whether given value has a then function.
 * @param wat A value to be checked.
 */
function isThenable(wat) {
    return Boolean(wat && wat.then && typeof wat.then === 'function');
}

/**
 * Checks whether given value's type is a SyntheticEvent
 * {@link isSyntheticEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isSyntheticEvent(wat) {
  return isPlainObject(wat) && 'nativeEvent' in wat && 'preventDefault' in wat && 'stopPropagation' in wat;
}

/**
 * Checks whether given value is NaN
 * {@link isNaN}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isNaN(wat) {
  return typeof wat === 'number' && wat !== wat;
}

/**
 * Checks whether given value's type is an instance of provided constructor.
 * {@link isInstanceOf}.
 *
 * @param wat A value to be checked.
 * @param base A constructor to be used in a check.
 * @returns A boolean representing the result.
 */
function isInstanceOf(wat, base) {
  try {
    return wat instanceof base;
  } catch (_e) {
    return false;
  }
}


//# sourceMappingURL=is.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CONSOLE_LEVELS": () => (/* binding */ CONSOLE_LEVELS),
/* harmony export */   "consoleSandbox": () => (/* binding */ consoleSandbox),
/* harmony export */   "logger": () => (/* binding */ logger)
/* harmony export */ });
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/global.js");


// TODO: Implement different loggers for different environments
var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();

/** Prefix for logging strings */
var PREFIX = 'Sentry Logger ';

var CONSOLE_LEVELS = ['debug', 'info', 'warn', 'error', 'log', 'assert', 'trace'] ;

/**
 * Temporarily disable sentry console instrumentations.
 *
 * @param callback The function to run against the original `console` messages
 * @returns The results of the callback
 */
function consoleSandbox(callback) {
  var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();

  if (!('console' in global)) {
    return callback();
  }

  var originalConsole = global.console ;
  var wrappedLevels = {};

  // Restore all wrapped console methods
  CONSOLE_LEVELS.forEach(level => {
    // TODO(v7): Remove this check as it's only needed for Node 6
    var originalWrappedFunc =
      originalConsole[level] && (originalConsole[level] ).__sentry_original__;
    if (level in global.console && originalWrappedFunc) {
      wrappedLevels[level] = originalConsole[level] ;
      originalConsole[level] = originalWrappedFunc ;
    }
  });

  try {
    return callback();
  } finally {
    // Revert restoration to wrapped state
    Object.keys(wrappedLevels).forEach(level => {
      originalConsole[level] = wrappedLevels[level ];
    });
  }
}

function makeLogger() {
  let enabled = false;
  var logger = {
    enable: () => {
      enabled = true;
    },
    disable: () => {
      enabled = false;
    },
  };

  if ((typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__)) {
    CONSOLE_LEVELS.forEach(name => {
            logger[name] = (...args) => {
        if (enabled) {
          consoleSandbox(() => {
            global.console[name](`${PREFIX}[${name}]:`, ...args);
          });
        }
      };
    });
  } else {
    CONSOLE_LEVELS.forEach(name => {
      logger[name] = () => undefined;
    });
  }

  return logger ;
}

// Ensure we only have a single logger instance, even if multiple versions of @sentry/utils are being used
let logger;
if ((typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__)) {
  logger = (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalSingleton)('logger', makeLogger);
} else {
  logger = makeLogger();
}


//# sourceMappingURL=logger.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/memo.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "memoBuilder": () => (/* binding */ memoBuilder)
/* harmony export */ });
/**
 * Helper to decycle json objects
 */
function memoBuilder() {
  var hasWeakSet = typeof WeakSet === 'function';
  var inner = hasWeakSet ? new WeakSet() : [];
  function memoize(obj) {
    if (hasWeakSet) {
      if (inner.has(obj)) {
        return true;
      }
      inner.add(obj);
      return false;
    }
        for (let i = 0; i < inner.length; i++) {
      var value = inner[i];
      if (value === obj) {
        return true;
      }
    }
    inner.push(obj);
    return false;
  }

  function unmemoize(obj) {
    if (hasWeakSet) {
      inner.delete(obj);
    } else {
      for (let i = 0; i < inner.length; i++) {
        if (inner[i] === obj) {
          inner.splice(i, 1);
          break;
        }
      }
    }
  }
  return [memoize, unmemoize];
}


//# sourceMappingURL=memo.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/misc.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addContextToFrame": () => (/* binding */ addContextToFrame),
/* harmony export */   "addExceptionMechanism": () => (/* binding */ addExceptionMechanism),
/* harmony export */   "addExceptionTypeValue": () => (/* binding */ addExceptionTypeValue),
/* harmony export */   "arrayify": () => (/* binding */ arrayify),
/* harmony export */   "checkOrSetAlreadyCaught": () => (/* binding */ checkOrSetAlreadyCaught),
/* harmony export */   "getEventDescription": () => (/* binding */ getEventDescription),
/* harmony export */   "parseSemver": () => (/* binding */ parseSemver),
/* harmony export */   "uuid4": () => (/* binding */ uuid4)
/* harmony export */ });
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/global.js");
/* harmony import */ var _object_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/object.js");
/* harmony import */ var _string_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/string.js");




/**
 * Extended Window interface that allows for Crypto API usage in IE browsers
 */

/**
 * UUID4 generator
 *
 * @returns string Generated UUID4.
 */
function uuid4() {
  var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)() ;
  var crypto = (global.crypto || global.msCrypto) ;

  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '');
  }

  var getRandomByte =
    crypto && crypto.getRandomValues ? () => crypto.getRandomValues(new Uint8Array(1))[0] : () => Math.random() * 16;

  // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
  // Concatenating the following numbers as strings results in '10000000100040008000100000000000'
  return (([1e7] ) + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, c =>
        ((c ) ^ ((getRandomByte() & 15) >> ((c ) / 4))).toString(16),
  );
}

function getFirstException(event) {
  return event.exception && event.exception.values ? event.exception.values[0] : undefined;
}

/**
 * Extracts either message or type+value from an event that can be used for user-facing logs
 * @returns event's description
 */
function getEventDescription(event) {
  const { message, event_id: eventId } = event;
  if (message) {
    return message;
  }

  var firstException = getFirstException(event);
  if (firstException) {
    if (firstException.type && firstException.value) {
      return `${firstException.type}: ${firstException.value}`;
    }
    return firstException.type || firstException.value || eventId || '<unknown>';
  }
  return eventId || '<unknown>';
}

/**
 * Adds exception values, type and value to an synthetic Exception.
 * @param event The event to modify.
 * @param value Value of the exception.
 * @param type Type of the exception.
 * @hidden
 */
function addExceptionTypeValue(event, value, type) {
  var exception = (event.exception = event.exception || {});
  var values = (exception.values = exception.values || []);
  var firstException = (values[0] = values[0] || {});
  if (!firstException.value) {
    firstException.value = value || '';
  }
  if (!firstException.type) {
    firstException.type = type || 'Error';
  }
}

/**
 * Adds exception mechanism data to a given event. Uses defaults if the second parameter is not passed.
 *
 * @param event The event to modify.
 * @param newMechanism Mechanism data to add to the event.
 * @hidden
 */
function addExceptionMechanism(event, newMechanism) {
  var firstException = getFirstException(event);
  if (!firstException) {
    return;
  }

  var defaultMechanism = { type: 'generic', handled: true };
  var currentMechanism = firstException.mechanism;
  firstException.mechanism = { ...defaultMechanism, ...currentMechanism, ...newMechanism };

  if (newMechanism && 'data' in newMechanism) {
    var mergedData = { ...(currentMechanism && currentMechanism.data), ...newMechanism.data };
    firstException.mechanism.data = mergedData;
  }
}

// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
var SEMVER_REGEXP =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

/**
 * Represents Semantic Versioning object
 */

/**
 * Parses input into a SemVer interface
 * @param input string representation of a semver version
 */
function parseSemver(input) {
  var match = input.match(SEMVER_REGEXP) || [];
  var major = parseInt(match[1], 10);
  var minor = parseInt(match[2], 10);
  var patch = parseInt(match[3], 10);
  return {
    buildmetadata: match[5],
    major: isNaN(major) ? undefined : major,
    minor: isNaN(minor) ? undefined : minor,
    patch: isNaN(patch) ? undefined : patch,
    prerelease: match[4],
  };
}

/**
 * This function adds context (pre/post/line) lines to the provided frame
 *
 * @param lines string[] containing all lines
 * @param frame StackFrame that will be mutated
 * @param linesOfContext number of context lines we want to add pre/post
 */
function addContextToFrame(lines, frame, linesOfContext = 5) {
  var lineno = frame.lineno || 0;
  var maxLines = lines.length;
  var sourceLine = Math.max(Math.min(maxLines, lineno - 1), 0);

  frame.pre_context = lines
    .slice(Math.max(0, sourceLine - linesOfContext), sourceLine)
    .map((line) => (0,_string_js__WEBPACK_IMPORTED_MODULE_1__.snipLine)(line, 0));

  frame.context_line = (0,_string_js__WEBPACK_IMPORTED_MODULE_1__.snipLine)(lines[Math.min(maxLines - 1, sourceLine)], frame.colno || 0);

  frame.post_context = lines
    .slice(Math.min(sourceLine + 1, maxLines), sourceLine + 1 + linesOfContext)
    .map((line) => (0,_string_js__WEBPACK_IMPORTED_MODULE_1__.snipLine)(line, 0));
}

/**
 * Checks whether or not we've already captured the given exception (note: not an identical exception - the very object
 * in question), and marks it captured if not.
 *
 * This is useful because it's possible for an error to get captured by more than one mechanism. After we intercept and
 * record an error, we rethrow it (assuming we've intercepted it before it's reached the top-level global handlers), so
 * that we don't interfere with whatever effects the error might have had were the SDK not there. At that point, because
 * the error has been rethrown, it's possible for it to bubble up to some other code we've instrumented. If it's not
 * caught after that, it will bubble all the way up to the global handlers (which of course we also instrument). This
 * function helps us ensure that even if we encounter the same error more than once, we only record it the first time we
 * see it.
 *
 * Note: It will ignore primitives (always return `false` and not mark them as seen), as properties can't be set on
 * them. {@link: Object.objectify} can be used on exceptions to convert any that are primitives into their equivalent
 * object wrapper forms so that this check will always work. However, because we need to flag the exact object which
 * will get rethrown, and because that rethrowing happens outside of the event processing pipeline, the objectification
 * must be done before the exception captured.
 *
 * @param A thrown exception to check or flag as having been seen
 * @returns `true` if the exception has already been captured, `false` if not (with the side effect of marking it seen)
 */
function checkOrSetAlreadyCaught(exception) {
    if (exception && (exception ).__sentry_captured__) {
    return true;
  }

  try {
    // set it this way rather than by assignment so that it's not ennumerable and therefore isn't recorded by the
    // `ExtraErrorData` integration
    (0,_object_js__WEBPACK_IMPORTED_MODULE_2__.addNonEnumerableProperty)(exception , '__sentry_captured__', true);
  } catch (err) {
    // `exception` is a primitive, so we can't mark it seen
  }

  return false;
}

/**
 * Checks whether the given input is already an array, and if it isn't, wraps it in one.
 *
 * @param maybeArray Input to turn into an array, if necessary
 * @returns The input, if already an array, or an array with the input as the only element, if not
 */
function arrayify(maybeArray) {
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
}


//# sourceMappingURL=misc.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/node.js":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dynamicRequire": () => (/* binding */ dynamicRequire),
/* harmony export */   "isNodeEnv": () => (/* binding */ isNodeEnv),
/* harmony export */   "loadModule": () => (/* binding */ loadModule)
/* harmony export */ });
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/env.js");
/* module decorator */ module = __webpack_require__.hmd(module);


/**
 * NOTE: In order to avoid circular dependencies, if you add a function to this module and it needs to print something,
 * you must either a) use `console.log` rather than the logger, or b) put your function elsewhere.
 */

/**
 * Checks whether we're in the Node.js or Browser environment
 *
 * @returns Answer to given question
 */
function isNodeEnv() {
  // explicitly check for browser bundles as those can be optimized statically
  // by terser/rollup.
  return (
    !(0,_env_js__WEBPACK_IMPORTED_MODULE_0__.isBrowserBundle)() &&
    Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]'
  );
}

/**
 * Requires a module which is protected against bundler minification.
 *
 * @param request The module path to resolve
 */
function dynamicRequire(mod, request) {
    return mod.require(request);
}

/**
 * Helper for dynamically loading module that should work with linked dependencies.
 * The problem is that we _should_ be using `require(require.resolve(moduleName, { paths: [cwd()] }))`
 * However it's _not possible_ to do that with Webpack, as it has to know all the dependencies during
 * build time. `require.resolve` is also not available in any other way, so we cannot create,
 * a fake helper like we do with `dynamicRequire`.
 *
 * We always prefer to use local package, thus the value is not returned early from each `try/catch` block.
 * That is to mimic the behavior of `require.resolve` exactly.
 *
 * @param moduleName module name to require
 * @returns possibly required module
 */
function loadModule(moduleName) {
  let mod;

  try {
    mod = dynamicRequire(module, moduleName);
  } catch (e) {
    // no-empty
  }

  try {
    const { cwd } = dynamicRequire(module, 'process');
    mod = dynamicRequire(module, `${cwd()}/node_modules/${moduleName}`) ;
  } catch (e) {
    // no-empty
  }

  return mod;
}


//# sourceMappingURL=node.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/normalize.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "normalize": () => (/* binding */ normalize),
/* harmony export */   "normalizeToSize": () => (/* binding */ normalizeToSize),
/* harmony export */   "walk": () => (/* binding */ visit)
/* harmony export */ });
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/is.js");
/* harmony import */ var _memo_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/memo.js");
/* harmony import */ var _object_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/object.js");
/* harmony import */ var _stacktrace_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/stacktrace.js");





/**
 * Recursively normalizes the given object.
 *
 * - Creates a copy to prevent original input mutation
 * - Skips non-enumerable properties
 * - When stringifying, calls `toJSON` if implemented
 * - Removes circular references
 * - Translates non-serializable values (`undefined`/`NaN`/functions) to serializable format
 * - Translates known global objects/classes to a string representations
 * - Takes care of `Error` object serialization
 * - Optionally limits depth of final output
 * - Optionally limits number of properties/elements included in any single object/array
 *
 * @param input The object to be normalized.
 * @param depth The max depth to which to normalize the object. (Anything deeper stringified whole.)
 * @param maxProperties The max number of elements or properties to be included in any single array or
 * object in the normallized output.
 * @returns A normalized version of the object, or `"**non-serializable**"` if any errors are thrown during normalization.
 */
function normalize(input, depth = +Infinity, maxProperties = +Infinity) {
  try {
    // since we're at the outermost level, we don't provide a key
    return visit('', input, depth, maxProperties);
  } catch (err) {
    return { ERROR: `**non-serializable** (${err})` };
  }
}

/** JSDoc */
function normalizeToSize(
    object,
  // Default Node.js REPL depth
  depth = 3,
  // 100kB, as 200kB is max payload size, so half sounds reasonable
  maxSize = 100 * 1024,
) {
  var normalized = normalize(object, depth);

  if (jsonSize(normalized) > maxSize) {
    return normalizeToSize(object, depth - 1, maxSize);
  }

  return normalized ;
}

/**
 * Visits a node to perform normalization on it
 *
 * @param key The key corresponding to the given node
 * @param value The node to be visited
 * @param depth Optional number indicating the maximum recursion depth
 * @param maxProperties Optional maximum number of properties/elements included in any single object/array
 * @param memo Optional Memo class handling decycling
 */
function visit(
  key,
  value,
  depth = +Infinity,
  maxProperties = +Infinity,
  memo = (0,_memo_js__WEBPACK_IMPORTED_MODULE_0__.memoBuilder)(),
) {
  const [memoize, unmemoize] = memo;

  // Get the simple cases out of the way first
  if (value === null || (['number', 'boolean', 'string'].includes(typeof value) && !(0,_is_js__WEBPACK_IMPORTED_MODULE_1__.isNaN)(value))) {
    return value ;
  }

  var stringified = stringifyValue(key, value);

  // Anything we could potentially dig into more (objects or arrays) will have come back as `"[object XXXX]"`.
  // Everything else will have already been serialized, so if we don't see that pattern, we're done.
  if (!stringified.startsWith('[object ')) {
    return stringified;
  }

  // From here on, we can assert that `value` is either an object or an array.

  // Do not normalize objects that we know have already been normalized. As a general rule, the
  // "__sentry_skip_normalization__" property should only be used sparingly and only should only be set on objects that
  // have already been normalized.
  if ((value )['__sentry_skip_normalization__']) {
    return value ;
  }

  // We're also done if we've reached the max depth
  if (depth === 0) {
    // At this point we know `serialized` is a string of the form `"[object XXXX]"`. Clean it up so it's just `"[XXXX]"`.
    return stringified.replace('object ', '');
  }

  // If we've already visited this branch, bail out, as it's circular reference. If not, note that we're seeing it now.
  if (memoize(value)) {
    return '[Circular ~]';
  }

  // If the value has a `toJSON` method, we call it to extract more information
  var valueWithToJSON = value ;
  if (valueWithToJSON && typeof valueWithToJSON.toJSON === 'function') {
    try {
      var jsonValue = valueWithToJSON.toJSON();
      // We need to normalize the return value of `.toJSON()` in case it has circular references
      return visit('', jsonValue, depth - 1, maxProperties, memo);
    } catch (err) {
      // pass (The built-in `toJSON` failed, but we can still try to do it ourselves)
    }
  }

  // At this point we know we either have an object or an array, we haven't seen it before, and we're going to recurse
  // because we haven't yet reached the max depth. Create an accumulator to hold the results of visiting each
  // property/entry, and keep track of the number of items we add to it.
  var normalized = (Array.isArray(value) ? [] : {}) ;
  let numAdded = 0;

  // Before we begin, convert`Error` and`Event` instances into plain objects, since some of each of their relevant
  // properties are non-enumerable and otherwise would get missed.
  var visitable = (0,_object_js__WEBPACK_IMPORTED_MODULE_2__.convertToPlainObject)(value );

  for (var visitKey in visitable) {
    // Avoid iterating over fields in the prototype if they've somehow been exposed to enumeration.
    if (!Object.prototype.hasOwnProperty.call(visitable, visitKey)) {
      continue;
    }

    if (numAdded >= maxProperties) {
      normalized[visitKey] = '[MaxProperties ~]';
      break;
    }

    // Recursively visit all the child nodes
    var visitValue = visitable[visitKey];
    normalized[visitKey] = visit(visitKey, visitValue, depth - 1, maxProperties, memo);

    numAdded += 1;
  }

  // Once we've visited all the branches, remove the parent from memo storage
  unmemoize(value);

  // Return accumulated values
  return normalized;
}

/**
 * Stringify the given value. Handles various known special values and types.
 *
 * Not meant to be used on simple primitives which already have a string representation, as it will, for example, turn
 * the number 1231 into "[Object Number]", nor on `null`, as it will throw.
 *
 * @param value The value to stringify
 * @returns A stringified representation of the given value
 */
function stringifyValue(
  key,
  // this type is a tiny bit of a cheat, since this function does handle NaN (which is technically a number), but for
  // our internal use, it'll do
  value,
) {
  try {
    if (key === 'domain' && value && typeof value === 'object' && (value )._events) {
      return '[Domain]';
    }

    if (key === 'domainEmitter') {
      return '[DomainEmitter]';
    }

    // It's safe to use `global`, `window`, and `document` here in this manner, as we are asserting using `typeof` first
    // which won't throw if they are not present.

    if (typeof global !== 'undefined' && value === global) {
      return '[Global]';
    }

        if (typeof window !== 'undefined' && value === window) {
      return '[Window]';
    }

        if (typeof document !== 'undefined' && value === document) {
      return '[Document]';
    }

    // React's SyntheticEvent thingy
    if ((0,_is_js__WEBPACK_IMPORTED_MODULE_1__.isSyntheticEvent)(value)) {
      return '[SyntheticEvent]';
    }

    if (typeof value === 'number' && value !== value) {
      return '[NaN]';
    }

    // this catches `undefined` (but not `null`, which is a primitive and can be serialized on its own)
    if (value === void 0) {
      return '[undefined]';
    }

    if (typeof value === 'function') {
      return `[Function: ${(0,_stacktrace_js__WEBPACK_IMPORTED_MODULE_3__.getFunctionName)(value)}]`;
    }

    if (typeof value === 'symbol') {
      return `[${String(value)}]`;
    }

    // stringified BigInts are indistinguishable from regular numbers, so we need to label them to avoid confusion
    if (typeof value === 'bigint') {
      return `[BigInt: ${String(value)}]`;
    }

    // Now that we've knocked out all the special cases and the primitives, all we have left are objects. Simply casting
    // them to strings means that instances of classes which haven't defined their `toStringTag` will just come out as
    // `"[object Object]"`. If we instead look at the constructor's name (which is the same as the name of the class),
    // we can make sure that only plain objects come out that way.
    return `[object ${(Object.getPrototypeOf(value) ).constructor.name}]`;
  } catch (err) {
    return `**non-serializable** (${err})`;
  }
}

/** Calculates bytes size of input string */
function utf8Length(value) {
    return ~-encodeURI(value).split(/%..|./).length;
}

/** Calculates bytes size of input object */
function jsonSize(value) {
  return utf8Length(JSON.stringify(value));
}


//# sourceMappingURL=normalize.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/object.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addNonEnumerableProperty": () => (/* binding */ addNonEnumerableProperty),
/* harmony export */   "convertToPlainObject": () => (/* binding */ convertToPlainObject),
/* harmony export */   "dropUndefinedKeys": () => (/* binding */ dropUndefinedKeys),
/* harmony export */   "extractExceptionKeysForMessage": () => (/* binding */ extractExceptionKeysForMessage),
/* harmony export */   "fill": () => (/* binding */ fill),
/* harmony export */   "getOriginalFunction": () => (/* binding */ getOriginalFunction),
/* harmony export */   "markFunctionWrapped": () => (/* binding */ markFunctionWrapped),
/* harmony export */   "objectify": () => (/* binding */ objectify),
/* harmony export */   "urlEncode": () => (/* binding */ urlEncode)
/* harmony export */ });
/* harmony import */ var _browser_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/browser.js");
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/is.js");
/* harmony import */ var _string_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/string.js");




/**
 * Replace a method in an object with a wrapped version of itself.
 *
 * @param source An object that contains a method to be wrapped.
 * @param name The name of the method to be wrapped.
 * @param replacementFactory A higher-order function that takes the original version of the given method and returns a
 * wrapped version. Note: The function returned by `replacementFactory` needs to be a non-arrow function, in order to
 * preserve the correct value of `this`, and the original method must be called using `origMethod.call(this, <other
 * args>)` or `origMethod.apply(this, [<other args>])` (rather than being called directly), again to preserve `this`.
 * @returns void
 */
function fill(source, name, replacementFactory) {
  if (!(name in source)) {
    return;
  }

  var original = source[name] ;
  var wrapped = replacementFactory(original) ;

  // Make sure it's a function first, as we need to attach an empty prototype for `defineProperties` to work
  // otherwise it'll throw "TypeError: Object.defineProperties called on non-object"
  if (typeof wrapped === 'function') {
    try {
      markFunctionWrapped(wrapped, original);
    } catch (_Oo) {
      // This can throw if multiple fill happens on a global object like XMLHttpRequest
      // Fixes https://github.com/getsentry/sentry-javascript/issues/2043
    }
  }

  source[name] = wrapped;
}

/**
 * Defines a non-enumerable property on the given object.
 *
 * @param obj The object on which to set the property
 * @param name The name of the property to be set
 * @param value The value to which to set the property
 */
function addNonEnumerableProperty(obj, name, value) {
  Object.defineProperty(obj, name, {
    // enumerable: false, // the default, so we can save on bundle size by not explicitly setting it
    value: value,
    writable: true,
    configurable: true,
  });
}

/**
 * Remembers the original function on the wrapped function and
 * patches up the prototype.
 *
 * @param wrapped the wrapper function
 * @param original the original function that gets wrapped
 */
function markFunctionWrapped(wrapped, original) {
  var proto = original.prototype || {};
  wrapped.prototype = original.prototype = proto;
  addNonEnumerableProperty(wrapped, '__sentry_original__', original);
}

/**
 * This extracts the original function if available.  See
 * `markFunctionWrapped` for more information.
 *
 * @param func the function to unwrap
 * @returns the unwrapped version of the function if available.
 */
function getOriginalFunction(func) {
  return func.__sentry_original__;
}

/**
 * Encodes given object into url-friendly format
 *
 * @param object An object that contains serializable values
 * @returns string Encoded
 */
function urlEncode(object) {
  return Object.keys(object)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`)
    .join('&');
}

/**
 * Transforms any `Error` or `Event` into a plain object with all of their enumerable properties, and some of their
 * non-enumerable properties attached.
 *
 * @param value Initial source that we have to transform in order for it to be usable by the serializer
 * @returns An Event or Error turned into an object - or the value argurment itself, when value is neither an Event nor
 *  an Error.
 */
function convertToPlainObject(
  value,
)

 {
  if ((0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isError)(value)) {
    return {
      message: value.message,
      name: value.name,
      stack: value.stack,
      ...getOwnProperties(value),
    };
  } else if ((0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isEvent)(value)) {
    var newObj

 = {
      type: value.type,
      target: serializeEventTarget(value.target),
      currentTarget: serializeEventTarget(value.currentTarget),
      ...getOwnProperties(value),
    };

    if (typeof CustomEvent !== 'undefined' && (0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isInstanceOf)(value, CustomEvent)) {
      newObj.detail = value.detail;
    }

    return newObj;
  } else {
    return value;
  }
}

/** Creates a string representation of the target of an `Event` object */
function serializeEventTarget(target) {
  try {
    return (0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(target) ? (0,_browser_js__WEBPACK_IMPORTED_MODULE_1__.htmlTreeAsString)(target) : Object.prototype.toString.call(target);
  } catch (_oO) {
    return '<unknown>';
  }
}

/** Filters out all but an object's own properties */
function getOwnProperties(obj) {
  if (typeof obj === 'object' && obj !== null) {
    var extractedProps = {};
    for (var property in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, property)) {
        extractedProps[property] = (obj )[property];
      }
    }
    return extractedProps;
  } else {
    return {};
  }
}

/**
 * Given any captured exception, extract its keys and create a sorted
 * and truncated list that will be used inside the event message.
 * eg. `Non-error exception captured with keys: foo, bar, baz`
 */
function extractExceptionKeysForMessage(exception, maxLength = 40) {
  var keys = Object.keys(convertToPlainObject(exception));
  keys.sort();

  if (!keys.length) {
    return '[object has no keys]';
  }

  if (keys[0].length >= maxLength) {
    return (0,_string_js__WEBPACK_IMPORTED_MODULE_2__.truncate)(keys[0], maxLength);
  }

  for (let includedKeys = keys.length; includedKeys > 0; includedKeys--) {
    var serialized = keys.slice(0, includedKeys).join(', ');
    if (serialized.length > maxLength) {
      continue;
    }
    if (includedKeys === keys.length) {
      return serialized;
    }
    return (0,_string_js__WEBPACK_IMPORTED_MODULE_2__.truncate)(serialized, maxLength);
  }

  return '';
}

/**
 * Given any object, return a new object having removed all fields whose value was `undefined`.
 * Works recursively on objects and arrays.
 *
 * Attention: This function keeps circular references in the returned object.
 */
function dropUndefinedKeys(inputValue) {
  // This map keeps track of what already visited nodes map to.
  // Our Set - based memoBuilder doesn't work here because we want to the output object to have the same circular
  // references as the input object.
  var memoizationMap = new Map();

  // This function just proxies `_dropUndefinedKeys` to keep the `memoBuilder` out of this function's API
  return _dropUndefinedKeys(inputValue, memoizationMap);
}

function _dropUndefinedKeys(inputValue, memoizationMap) {
  if ((0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(inputValue)) {
    // If this node has already been visited due to a circular reference, return the object it was mapped to in the new object
    var memoVal = memoizationMap.get(inputValue);
    if (memoVal !== undefined) {
      return memoVal ;
    }

    var returnValue = {};
    // Store the mapping of this value in case we visit it again, in case of circular data
    memoizationMap.set(inputValue, returnValue);

    for (var key of Object.keys(inputValue)) {
      if (typeof inputValue[key] !== 'undefined') {
        returnValue[key] = _dropUndefinedKeys(inputValue[key], memoizationMap);
      }
    }

    return returnValue ;
  }

  if (Array.isArray(inputValue)) {
    // If this node has already been visited due to a circular reference, return the array it was mapped to in the new object
    var memoVal = memoizationMap.get(inputValue);
    if (memoVal !== undefined) {
      return memoVal ;
    }

    var returnValue = [];
    // Store the mapping of this value in case we visit it again, in case of circular data
    memoizationMap.set(inputValue, returnValue);

    inputValue.forEach((item) => {
      returnValue.push(_dropUndefinedKeys(item, memoizationMap));
    });

    return returnValue ;
  }

  return inputValue;
}

/**
 * Ensure that something is an object.
 *
 * Turns `undefined` and `null` into `String`s and all other primitives into instances of their respective wrapper
 * classes (String, Boolean, Number, etc.). Acts as the identity function on non-primitives.
 *
 * @param wat The subject of the objectification
 * @returns A version of `wat` which can safely be used with `Object` class methods
 */
function objectify(wat) {
  let objectified;
  switch (true) {
    case wat === undefined || wat === null:
      objectified = new String(wat);
      break;

    // Though symbols and bigints do have wrapper classes (`Symbol` and `BigInt`, respectively), for whatever reason
    // those classes don't have constructors which can be used with the `new` keyword. We therefore need to cast each as
    // an object in order to wrap it.
    case typeof wat === 'symbol' || typeof wat === 'bigint':
      objectified = Object(wat);
      break;

    // this will catch the remaining primitives: `String`, `Number`, and `Boolean`
    case (0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isPrimitive)(wat):
            objectified = new (wat ).constructor(wat);
      break;

    // by process of elimination, at this point we know that `wat` must already be an object
    default:
      objectified = wat;
      break;
  }
  return objectified;
}


//# sourceMappingURL=object.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/requestdata.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addRequestDataToEvent": () => (/* binding */ addRequestDataToEvent),
/* harmony export */   "addRequestDataToTransaction": () => (/* binding */ addRequestDataToTransaction),
/* harmony export */   "extractPathForTransaction": () => (/* binding */ extractPathForTransaction),
/* harmony export */   "extractRequestData": () => (/* binding */ extractRequestData)
/* harmony export */ });
/* harmony import */ var _buildPolyfills__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/is.js");
/* harmony import */ var _normalize_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/normalize.js");
/* harmony import */ var _url_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/url.js");





var DEFAULT_INCLUDES = {
  ip: false,
  request: true,
  transaction: true,
  user: true,
};
var DEFAULT_REQUEST_INCLUDES = ['cookies', 'data', 'headers', 'method', 'query_string', 'url'];
var DEFAULT_USER_INCLUDES = ['id', 'username', 'email'];

/**
 * Sets parameterized route as transaction name e.g.: `GET /users/:id`
 * Also adds more context data on the transaction from the request
 */
function addRequestDataToTransaction(
  transaction,
  req,
  deps,
) {
  if (!transaction) return;
  if (!transaction.metadata.source || transaction.metadata.source === 'url') {
    // Attempt to grab a parameterized route off of the request
    transaction.setName(...extractPathForTransaction(req, { path: true, method: true }));
  }
  transaction.setData('url', req.originalUrl || req.url);
  if (req.baseUrl) {
    transaction.setData('baseUrl', req.baseUrl);
  }
  transaction.setData('query', extractQueryParams(req, deps));
}

/**
 * Extracts a complete and parameterized path from the request object and uses it to construct transaction name.
 * If the parameterized transaction name cannot be extracted, we fall back to the raw URL.
 *
 * Additionally, this function determines and returns the transaction name source
 *
 * eg. GET /mountpoint/user/:id
 *
 * @param req A request object
 * @param options What to include in the transaction name (method, path, or a custom route name to be
 *                used instead of the request's route)
 *
 * @returns A tuple of the fully constructed transaction name [0] and its source [1] (can be either 'route' or 'url')
 */
function extractPathForTransaction(
  req,
  options = {},
) {
  var method = req.method && req.method.toUpperCase();

  let path = '';
  let source = 'url';

  // Check to see if there's a parameterized route we can use (as there is in Express)
  if (options.customRoute || req.route) {
    path = options.customRoute || `${req.baseUrl || ''}${req.route && req.route.path}`;
    source = 'route';
  }

  // Otherwise, just take the original URL
  else if (req.originalUrl || req.url) {
    path = (0,_url_js__WEBPACK_IMPORTED_MODULE_0__.stripUrlQueryAndFragment)(req.originalUrl || req.url || '');
  }

  let name = '';
  if (options.method && method) {
    name += method;
  }
  if (options.method && options.path) {
    name += ' ';
  }
  if (options.path && path) {
    name += path;
  }

  return [name, source];
}

/** JSDoc */
function extractTransaction(req, type) {
  switch (type) {
    case 'path': {
      return extractPathForTransaction(req, { path: true })[0];
    }
    case 'handler': {
      return (req.route && req.route.stack && req.route.stack[0] && req.route.stack[0].name) || '<anonymous>';
    }
    case 'methodPath':
    default: {
      return extractPathForTransaction(req, { path: true, method: true })[0];
    }
  }
}

/** JSDoc */
function extractUserData(
  user

,
  keys,
) {
  var extractedUser = {};
  var attributes = Array.isArray(keys) ? keys : DEFAULT_USER_INCLUDES;

  attributes.forEach(key => {
    if (user && key in user) {
      extractedUser[key] = user[key];
    }
  });

  return extractedUser;
}

/**
 * Normalize data from the request object, accounting for framework differences.
 *
 * @param req The request object from which to extract data
 * @param options.include An optional array of keys to include in the normalized data. Defaults to
 * DEFAULT_REQUEST_INCLUDES if not provided.
 * @param options.deps Injected, platform-specific dependencies
 * @returns An object containing normalized request data
 */
function extractRequestData(
  req,
  options

,
) {
  const { include = DEFAULT_REQUEST_INCLUDES, deps } = options || {};
  var requestData = {};

  // headers:
  //   node, express, koa, nextjs: req.headers
  var headers = (req.headers || {}) 

;
  // method:
  //   node, express, koa, nextjs: req.method
  var method = req.method;
  // host:
  //   express: req.hostname in > 4 and req.host in < 4
  //   koa: req.host
  //   node, nextjs: req.headers.host
  var host = req.hostname || req.host || headers.host || '<no host>';
  // protocol:
  //   node, nextjs: <n/a>
  //   express, koa: req.protocol
  var protocol = req.protocol === 'https' || (req.socket && req.socket.encrypted) ? 'https' : 'http';
  // url (including path and query string):
  //   node, express: req.originalUrl
  //   koa, nextjs: req.url
  var originalUrl = req.originalUrl || req.url || '';
  // absolute url
  var absoluteUrl = `${protocol}://${host}${originalUrl}`;
  include.forEach(key => {
    switch (key) {
      case 'headers': {
        requestData.headers = headers;
        break;
      }
      case 'method': {
        requestData.method = method;
        break;
      }
      case 'url': {
        requestData.url = absoluteUrl;
        break;
      }
      case 'cookies': {
        // cookies:
        //   node, express, koa: req.headers.cookie
        //   vercel, sails.js, express (w/ cookie middleware), nextjs: req.cookies
                requestData.cookies =
          // TODO (v8 / #5257): We're only sending the empty object for backwards compatibility, so the last bit can
          // come off in v8
          req.cookies || (headers.cookie && deps && deps.cookie && deps.cookie.parse(headers.cookie)) || {};
        break;
      }
      case 'query_string': {
        // query string:
        //   node: req.url (raw)
        //   express, koa, nextjs: req.query
                requestData.query_string = extractQueryParams(req, deps);
        break;
      }
      case 'data': {
        if (method === 'GET' || method === 'HEAD') {
          break;
        }
        // body data:
        //   express, koa, nextjs: req.body
        //
        //   when using node by itself, you have to read the incoming stream(see
        //   https://nodejs.dev/learn/get-http-request-body-data-using-nodejs); if a user is doing that, we can't know
        //   where they're going to store the final result, so they'll have to capture this data themselves
        if (req.body !== undefined) {
          requestData.data = (0,_is_js__WEBPACK_IMPORTED_MODULE_1__.isString)(req.body) ? req.body : JSON.stringify((0,_normalize_js__WEBPACK_IMPORTED_MODULE_2__.normalize)(req.body));
        }
        break;
      }
      default: {
        if ({}.hasOwnProperty.call(req, key)) {
          requestData[key] = (req )[key];
        }
      }
    }
  });

  return requestData;
}

/**
 * Options deciding what parts of the request to use when enhancing an event
 */

/**
 * Add data from the given request to the given event
 *
 * @param event The event to which the request data will be added
 * @param req Request object
 * @param options.include Flags to control what data is included
 * @param options.deps Injected platform-specific dependencies
 * @hidden
 */
function addRequestDataToEvent(
  event,
  req,
  options,
) {
  var include = {
    ...DEFAULT_INCLUDES,
    ...(0,_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([options, 'optionalAccess', _ => _.include]),
  };

  if (include.request) {
    var extractedRequestData = Array.isArray(include.request)
      ? extractRequestData(req, { include: include.request, deps: (0,_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([options, 'optionalAccess', _2 => _2.deps]) })
      : extractRequestData(req, { deps: (0,_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([options, 'optionalAccess', _3 => _3.deps]) });

    event.request = {
      ...event.request,
      ...extractedRequestData,
    };
  }

  if (include.user) {
    var extractedUser = req.user && (0,_is_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(req.user) ? extractUserData(req.user, include.user) : {};

    if (Object.keys(extractedUser).length) {
      event.user = {
        ...event.user,
        ...extractedUser,
      };
    }
  }

  // client ip:
  //   node, nextjs: req.socket.remoteAddress
  //   express, koa: req.ip
  if (include.ip) {
    var ip = req.ip || (req.socket && req.socket.remoteAddress);
    if (ip) {
      event.user = {
        ...event.user,
        ip_address: ip,
      };
    }
  }

  if (include.transaction && !event.transaction) {
    // TODO do we even need this anymore?
    // TODO make this work for nextjs
    event.transaction = extractTransaction(req, include.transaction);
  }

  return event;
}

function extractQueryParams(
  req,
  deps,
) {
  // url (including path and query string):
  //   node, express: req.originalUrl
  //   koa, nextjs: req.url
  let originalUrl = req.originalUrl || req.url || '';

  if (!originalUrl) {
    return;
  }

  // The `URL` constructor can't handle internal URLs of the form `/some/path/here`, so stick a dummy protocol and
  // hostname on the beginning. Since the point here is just to grab the query string, it doesn't matter what we use.
  if (originalUrl.startsWith('/')) {
    originalUrl = `http://dogs.are.great${originalUrl}`;
  }

  return (
    req.query ||
    (typeof URL !== undefined && new URL(originalUrl).search.replace('?', '')) ||
    // In Node 8, `URL` isn't in the global scope, so we have to use the built-in module from Node
    (deps && deps.url && deps.url.parse(originalUrl).query) ||
    undefined
  );
}


//# sourceMappingURL=requestdata.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/stacktrace.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createStackParser": () => (/* binding */ createStackParser),
/* harmony export */   "getFunctionName": () => (/* binding */ getFunctionName),
/* harmony export */   "nodeStackLineParser": () => (/* binding */ nodeStackLineParser),
/* harmony export */   "stackParserFromStackParserOptions": () => (/* binding */ stackParserFromStackParserOptions),
/* harmony export */   "stripSentryFramesAndReverse": () => (/* binding */ stripSentryFramesAndReverse)
/* harmony export */ });
/* harmony import */ var _buildPolyfills__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");


var STACKTRACE_LIMIT = 50;

/**
 * Creates a stack parser with the supplied line parsers
 *
 * StackFrames are returned in the correct order for Sentry Exception
 * frames and with Sentry SDK internal frames removed from the top and bottom
 *
 */
function createStackParser(...parsers) {
  var sortedParsers = parsers.sort((a, b) => a[0] - b[0]).map(p => p[1]);

  return (stack, skipFirst = 0) => {
    var frames = [];

    for (var line of stack.split('\n').slice(skipFirst)) {
      // https://github.com/getsentry/sentry-javascript/issues/5459
      // Remove webpack (error: *) wrappers
      var cleanedLine = line.replace(/\(error: (.*)\)/, '$1');

      for (var parser of sortedParsers) {
        var frame = parser(cleanedLine);

        if (frame) {
          frames.push(frame);
          break;
        }
      }
    }

    return stripSentryFramesAndReverse(frames);
  };
}

/**
 * Gets a stack parser implementation from Options.stackParser
 * @see Options
 *
 * If options contains an array of line parsers, it is converted into a parser
 */
function stackParserFromStackParserOptions(stackParser) {
  if (Array.isArray(stackParser)) {
    return createStackParser(...stackParser);
  }
  return stackParser;
}

/**
 * @hidden
 */
function stripSentryFramesAndReverse(stack) {
  if (!stack.length) {
    return [];
  }

  let localStack = stack;

  var firstFrameFunction = localStack[0].function || '';
  var lastFrameFunction = localStack[localStack.length - 1].function || '';

  // If stack starts with one of our API calls, remove it (starts, meaning it's the top of the stack - aka last call)
  if (firstFrameFunction.indexOf('captureMessage') !== -1 || firstFrameFunction.indexOf('captureException') !== -1) {
    localStack = localStack.slice(1);
  }

  // If stack ends with one of our internal API calls, remove it (ends, meaning it's the bottom of the stack - aka top-most call)
  if (lastFrameFunction.indexOf('sentryWrapped') !== -1) {
    localStack = localStack.slice(0, -1);
  }

  // The frame where the crash happened, should be the last entry in the array
  return localStack
    .slice(0, STACKTRACE_LIMIT)
    .map(frame => ({
      ...frame,
      filename: frame.filename || localStack[0].filename,
      function: frame.function || '?',
    }))
    .reverse();
}

var defaultFunctionName = '<anonymous>';

/**
 * Safely extract function name from itself
 */
function getFunctionName(fn) {
  try {
    if (!fn || typeof fn !== 'function') {
      return defaultFunctionName;
    }
    return fn.name || defaultFunctionName;
  } catch (e) {
    // Just accessing custom props in some Selenium environments
    // can cause a "Permission denied" exception (see raven-js#495).
    return defaultFunctionName;
  }
}

function node(getModule) {
  var FILENAME_MATCH = /^\s*[-]{4,}$/;
  var FULL_MATCH = /at (?:async )?(?:(.+?)\s+\()?(?:(.+):(\d+):(\d+)?|([^)]+))\)?/;

    return (line) => {
    if (line.match(FILENAME_MATCH)) {
      return {
        filename: line,
      };
    }

    var lineMatch = line.match(FULL_MATCH);
    if (!lineMatch) {
      return undefined;
    }

    let object;
    let method;
    let functionName;
    let typeName;
    let methodName;

    if (lineMatch[1]) {
      functionName = lineMatch[1];

      let methodStart = functionName.lastIndexOf('.');
      if (functionName[methodStart - 1] === '.') {
                methodStart--;
      }

      if (methodStart > 0) {
        object = functionName.substr(0, methodStart);
        method = functionName.substr(methodStart + 1);
        var objectEnd = object.indexOf('.Module');
        if (objectEnd > 0) {
          functionName = functionName.substr(objectEnd + 1);
          object = object.substr(0, objectEnd);
        }
      }
      typeName = undefined;
    }

    if (method) {
      typeName = object;
      methodName = method;
    }

    if (method === '<anonymous>') {
      methodName = undefined;
      functionName = undefined;
    }

    if (functionName === undefined) {
      methodName = methodName || '<anonymous>';
      functionName = typeName ? `${typeName}.${methodName}` : methodName;
    }

    var filename = (0,_buildPolyfills__WEBPACK_IMPORTED_MODULE_0__._optionalChain)([lineMatch, 'access', _ => _[2], 'optionalAccess', _2 => _2.startsWith, 'call', _3 => _3('file://')]) ? lineMatch[2].substr(7) : lineMatch[2];
    var isNative = lineMatch[5] === 'native';
    var isInternal =
      isNative || (filename && !filename.startsWith('/') && !filename.startsWith('.') && filename.indexOf(':\\') !== 1);

    // in_app is all that's not an internal Node function or a module within node_modules
    // note that isNative appears to return true even for node core libraries
    // see https://github.com/getsentry/raven-node/issues/176
    var in_app = !isInternal && filename !== undefined && !filename.includes('node_modules/');

    return {
      filename,
      module: (0,_buildPolyfills__WEBPACK_IMPORTED_MODULE_0__._optionalChain)([getModule, 'optionalCall', _4 => _4(filename)]),
      function: functionName,
      lineno: parseInt(lineMatch[3], 10) || undefined,
      colno: parseInt(lineMatch[4], 10) || undefined,
      in_app,
    };
  };
}

/**
 * Node.js stack line parser
 *
 * This is in @sentry/utils so it can be used from the Electron SDK in the browser for when `nodeIntegration == true`.
 * This allows it to be used without referencing or importing any node specific code which causes bundlers to complain
 */
function nodeStackLineParser(getModule) {
  return [90, node(getModule)];
}


//# sourceMappingURL=stacktrace.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/string.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "escapeStringForRegex": () => (/* binding */ escapeStringForRegex),
/* harmony export */   "isMatchingPattern": () => (/* binding */ isMatchingPattern),
/* harmony export */   "safeJoin": () => (/* binding */ safeJoin),
/* harmony export */   "snipLine": () => (/* binding */ snipLine),
/* harmony export */   "truncate": () => (/* binding */ truncate)
/* harmony export */ });
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/is.js");


/**
 * Truncates given string to the maximum characters count
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string (0 = unlimited)
 * @returns string Encoded
 */
function truncate(str, max = 0) {
  if (typeof str !== 'string' || max === 0) {
    return str;
  }
  return str.length <= max ? str : `${str.substr(0, max)}...`;
}

/**
 * This is basically just `trim_line` from
 * https://github.com/getsentry/sentry/blob/master/src/sentry/lang/javascript/processor.py#L67
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string
 * @returns string Encoded
 */
function snipLine(line, colno) {
  let newLine = line;
  var lineLength = newLine.length;
  if (lineLength <= 150) {
    return newLine;
  }
  if (colno > lineLength) {
        colno = lineLength;
  }

  let start = Math.max(colno - 60, 0);
  if (start < 5) {
    start = 0;
  }

  let end = Math.min(start + 140, lineLength);
  if (end > lineLength - 5) {
    end = lineLength;
  }
  if (end === lineLength) {
    start = Math.max(end - 140, 0);
  }

  newLine = newLine.slice(start, end);
  if (start > 0) {
    newLine = `'{snip} ${newLine}`;
  }
  if (end < lineLength) {
    newLine += ' {snip}';
  }

  return newLine;
}

/**
 * Join values in array
 * @param input array of values to be joined together
 * @param delimiter string to be placed in-between values
 * @returns Joined values
 */
function safeJoin(input, delimiter) {
  if (!Array.isArray(input)) {
    return '';
  }

  var output = [];
    for (let i = 0; i < input.length; i++) {
    var value = input[i];
    try {
      output.push(String(value));
    } catch (e) {
      output.push('[value cannot be serialized]');
    }
  }

  return output.join(delimiter);
}

/**
 * Checks if the value matches a regex or includes the string
 * @param value The string value to be checked against
 * @param pattern Either a regex or a string that must be contained in value
 */
function isMatchingPattern(value, pattern) {
  if (!(0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isString)(value)) {
    return false;
  }

  if ((0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isRegExp)(pattern)) {
    return pattern.test(value);
  }
  if (typeof pattern === 'string') {
    return value.indexOf(pattern) !== -1;
  }
  return false;
}

/**
 * Given a string, escape characters which have meaning in the regex grammar, such that the result is safe to feed to
 * `new RegExp()`.
 *
 * Based on https://github.com/sindresorhus/escape-string-regexp. Vendored to a) reduce the size by skipping the runtime
 * type-checking, and b) ensure it gets down-compiled for old versions of Node (the published package only supports Node
 * 12+).
 *
 * @param regexString The string to escape
 * @returns An version of the string with all special regex characters escaped
 */
function escapeStringForRegex(regexString) {
  // escape the hyphen separately so we can also replace it with a unicode literal hyphen, to avoid the problems
  // discussed in https://github.com/sindresorhus/escape-string-regexp/issues/20.
  return regexString.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}


//# sourceMappingURL=string.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/supports.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isNativeFetch": () => (/* binding */ isNativeFetch),
/* harmony export */   "supportsDOMError": () => (/* binding */ supportsDOMError),
/* harmony export */   "supportsDOMException": () => (/* binding */ supportsDOMException),
/* harmony export */   "supportsErrorEvent": () => (/* binding */ supportsErrorEvent),
/* harmony export */   "supportsFetch": () => (/* binding */ supportsFetch),
/* harmony export */   "supportsHistory": () => (/* binding */ supportsHistory),
/* harmony export */   "supportsNativeFetch": () => (/* binding */ supportsNativeFetch),
/* harmony export */   "supportsReferrerPolicy": () => (/* binding */ supportsReferrerPolicy),
/* harmony export */   "supportsReportingObserver": () => (/* binding */ supportsReportingObserver)
/* harmony export */ });
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/global.js");
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/logger.js");



/**
 * Tells whether current environment supports ErrorEvent objects
 * {@link supportsErrorEvent}.
 *
 * @returns Answer to the given question.
 */
function supportsErrorEvent() {
  try {
    new ErrorEvent('');
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Tells whether current environment supports DOMError objects
 * {@link supportsDOMError}.
 *
 * @returns Answer to the given question.
 */
function supportsDOMError() {
  try {
    // Chrome: VM89:1 Uncaught TypeError: Failed to construct 'DOMError':
    // 1 argument required, but only 0 present.
    // @ts-ignore It really needs 1 argument, not 0.
    new DOMError('');
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Tells whether current environment supports DOMException objects
 * {@link supportsDOMException}.
 *
 * @returns Answer to the given question.
 */
function supportsDOMException() {
  try {
    new DOMException('');
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Tells whether current environment supports Fetch API
 * {@link supportsFetch}.
 *
 * @returns Answer to the given question.
 */
function supportsFetch() {
  if (!('fetch' in (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)())) {
    return false;
  }

  try {
    new Headers();
    new Request('http://www.example.com');
    new Response();
    return true;
  } catch (e) {
    return false;
  }
}
/**
 * isNativeFetch checks if the given function is a native implementation of fetch()
 */
function isNativeFetch(func) {
  return func && /^function fetch\(\)\s+\{\s+\[native code\]\s+\}$/.test(func.toString());
}

/**
 * Tells whether current environment supports Fetch API natively
 * {@link supportsNativeFetch}.
 *
 * @returns true if `window.fetch` is natively implemented, false otherwise
 */
function supportsNativeFetch() {
  if (!supportsFetch()) {
    return false;
  }

  var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();

  // Fast path to avoid DOM I/O
    if (isNativeFetch(global.fetch)) {
    return true;
  }

  // window.fetch is implemented, but is polyfilled or already wrapped (e.g: by a chrome extension)
  // so create a "pure" iframe to see if that has native fetch
  let result = false;
  var doc = global.document;
    if (doc && typeof (doc.createElement ) === 'function') {
    try {
      var sandbox = doc.createElement('iframe');
      sandbox.hidden = true;
      doc.head.appendChild(sandbox);
      if (sandbox.contentWindow && sandbox.contentWindow.fetch) {
                result = isNativeFetch(sandbox.contentWindow.fetch);
      }
      doc.head.removeChild(sandbox);
    } catch (err) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
        _logger_js__WEBPACK_IMPORTED_MODULE_1__.logger.warn('Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ', err);
    }
  }

  return result;
}

/**
 * Tells whether current environment supports ReportingObserver API
 * {@link supportsReportingObserver}.
 *
 * @returns Answer to the given question.
 */
function supportsReportingObserver() {
  return 'ReportingObserver' in (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();
}

/**
 * Tells whether current environment supports Referrer Policy API
 * {@link supportsReferrerPolicy}.
 *
 * @returns Answer to the given question.
 */
function supportsReferrerPolicy() {
  // Despite all stars in the sky saying that Edge supports old draft syntax, aka 'never', 'always', 'origin' and 'default'
  // (see https://caniuse.com/#feat=referrer-policy),
  // it doesn't. And it throws an exception instead of ignoring this parameter...
  // REF: https://github.com/getsentry/raven-js/issues/1233

  if (!supportsFetch()) {
    return false;
  }

  try {
    new Request('_', {
      referrerPolicy: 'origin' ,
    });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Tells whether current environment supports History API
 * {@link supportsHistory}.
 *
 * @returns Answer to the given question.
 */
function supportsHistory() {
  // NOTE: in Chrome App environment, touching history.pushState, *even inside
  //       a try/catch block*, will cause Chrome to output an error to console.error
  // borrowed from: https://github.com/angular/angular.js/pull/13945/files
  var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();
      var chrome = (global ).chrome;
  var isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
    var hasHistoryApi = 'history' in global && !!global.history.pushState && !!global.history.replaceState;

  return !isChromePackagedApp && hasHistoryApi;
}


//# sourceMappingURL=supports.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/syncpromise.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SyncPromise": () => (/* binding */ SyncPromise),
/* harmony export */   "rejectedSyncPromise": () => (/* binding */ rejectedSyncPromise),
/* harmony export */   "resolvedSyncPromise": () => (/* binding */ resolvedSyncPromise)
/* harmony export */ });
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/is.js");


/** SyncPromise internal states */
var States; (function (States) {
  /** Pending */
  var PENDING = 0; States[States["PENDING"] = PENDING] = "PENDING";
  /** Resolved / OK */
  var RESOLVED = 1; States[States["RESOLVED"] = RESOLVED] = "RESOLVED";
  /** Rejected / Error */
  var REJECTED = 2; States[States["REJECTED"] = REJECTED] = "REJECTED";
})(States || (States = {}));

// Overloads so we can call resolvedSyncPromise without arguments and generic argument

/**
 * Creates a resolved sync promise.
 *
 * @param value the value to resolve the promise with
 * @returns the resolved sync promise
 */
function resolvedSyncPromise(value) {
  return new SyncPromise(resolve => {
    resolve(value);
  });
}

/**
 * Creates a rejected sync promise.
 *
 * @param value the value to reject the promise with
 * @returns the rejected sync promise
 */
function rejectedSyncPromise(reason) {
  return new SyncPromise((_, reject) => {
    reject(reason);
  });
}

/**
 * Thenable class that behaves like a Promise and follows it's interface
 * but is not async internally
 */
class SyncPromise {
   __init() {this._state = States.PENDING;}
   __init2() {this._handlers = [];}
  

   constructor(
    executor,
  ) {;SyncPromise.prototype.__init.call(this);SyncPromise.prototype.__init2.call(this);SyncPromise.prototype.__init3.call(this);SyncPromise.prototype.__init4.call(this);SyncPromise.prototype.__init5.call(this);SyncPromise.prototype.__init6.call(this);
    try {
      executor(this._resolve, this._reject);
    } catch (e) {
      this._reject(e);
    }
  }

  /** JSDoc */
   then(
    onfulfilled,
    onrejected,
  ) {
    return new SyncPromise((resolve, reject) => {
      this._handlers.push([
        false,
        result => {
          if (!onfulfilled) {
            // TODO: ¯\_(ツ)_/¯
            // TODO: FIXME
            resolve(result );
          } else {
            try {
              resolve(onfulfilled(result));
            } catch (e) {
              reject(e);
            }
          }
        },
        reason => {
          if (!onrejected) {
            reject(reason);
          } else {
            try {
              resolve(onrejected(reason));
            } catch (e) {
              reject(e);
            }
          }
        },
      ]);
      this._executeHandlers();
    });
  }

  /** JSDoc */
   catch(
    onrejected,
  ) {
    return this.then(val => val, onrejected);
  }

  /** JSDoc */
   finally(onfinally) {
    return new SyncPromise((resolve, reject) => {
      let val;
      let isRejected;

      return this.then(
        value => {
          isRejected = false;
          val = value;
          if (onfinally) {
            onfinally();
          }
        },
        reason => {
          isRejected = true;
          val = reason;
          if (onfinally) {
            onfinally();
          }
        },
      ).then(() => {
        if (isRejected) {
          reject(val);
          return;
        }

        resolve(val );
      });
    });
  }

  /** JSDoc */
    __init3() {this._resolve = (value) => {
    this._setResult(States.RESOLVED, value);
  };}

  /** JSDoc */
    __init4() {this._reject = (reason) => {
    this._setResult(States.REJECTED, reason);
  };}

  /** JSDoc */
    __init5() {this._setResult = (state, value) => {
    if (this._state !== States.PENDING) {
      return;
    }

    if ((0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isThenable)(value)) {
      void (value ).then(this._resolve, this._reject);
      return;
    }

    this._state = state;
    this._value = value;

    this._executeHandlers();
  };}

  /** JSDoc */
    __init6() {this._executeHandlers = () => {
    if (this._state === States.PENDING) {
      return;
    }

    var cachedHandlers = this._handlers.slice();
    this._handlers = [];

    cachedHandlers.forEach(handler => {
      if (handler[0]) {
        return;
      }

      if (this._state === States.RESOLVED) {
                handler[1](this._value );
      }

      if (this._state === States.REJECTED) {
        handler[2](this._value);
      }

      handler[0] = true;
    });
  };}
}


//# sourceMappingURL=syncpromise.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/time.js":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_browserPerformanceTimeOriginMode": () => (/* binding */ _browserPerformanceTimeOriginMode),
/* harmony export */   "browserPerformanceTimeOrigin": () => (/* binding */ browserPerformanceTimeOrigin),
/* harmony export */   "dateTimestampInSeconds": () => (/* binding */ dateTimestampInSeconds),
/* harmony export */   "timestampInSeconds": () => (/* binding */ timestampInSeconds),
/* harmony export */   "timestampWithMs": () => (/* binding */ timestampWithMs),
/* harmony export */   "usingPerformanceAPI": () => (/* binding */ usingPerformanceAPI)
/* harmony export */ });
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/global.js");
/* harmony import */ var _node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/node.js");
/* module decorator */ module = __webpack_require__.hmd(module);



/**
 * An object that can return the current timestamp in seconds since the UNIX epoch.
 */

/**
 * A TimestampSource implementation for environments that do not support the Performance Web API natively.
 *
 * Note that this TimestampSource does not use a monotonic clock. A call to `nowSeconds` may return a timestamp earlier
 * than a previously returned value. We do not try to emulate a monotonic behavior in order to facilitate debugging. It
 * is more obvious to explain "why does my span have negative duration" than "why my spans have zero duration".
 */
var dateTimestampSource = {
  nowSeconds: () => Date.now() / 1000,
};

/**
 * A partial definition of the [Performance Web API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Performance}
 * for accessing a high-resolution monotonic clock.
 */

/**
 * Returns a wrapper around the native Performance API browser implementation, or undefined for browsers that do not
 * support the API.
 *
 * Wrapping the native API works around differences in behavior from different browsers.
 */
function getBrowserPerformance() {
  const { performance } = (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();
  if (!performance || !performance.now) {
    return undefined;
  }

  // Replace performance.timeOrigin with our own timeOrigin based on Date.now().
  //
  // This is a partial workaround for browsers reporting performance.timeOrigin such that performance.timeOrigin +
  // performance.now() gives a date arbitrarily in the past.
  //
  // Additionally, computing timeOrigin in this way fills the gap for browsers where performance.timeOrigin is
  // undefined.
  //
  // The assumption that performance.timeOrigin + performance.now() ~= Date.now() is flawed, but we depend on it to
  // interact with data coming out of performance entries.
  //
  // Note that despite recommendations against it in the spec, browsers implement the Performance API with a clock that
  // might stop when the computer is asleep (and perhaps under other circumstances). Such behavior causes
  // performance.timeOrigin + performance.now() to have an arbitrary skew over Date.now(). In laptop computers, we have
  // observed skews that can be as long as days, weeks or months.
  //
  // See https://github.com/getsentry/sentry-javascript/issues/2590.
  //
  // BUG: despite our best intentions, this workaround has its limitations. It mostly addresses timings of pageload
  // transactions, but ignores the skew built up over time that can aversely affect timestamps of navigation
  // transactions of long-lived web pages.
  var timeOrigin = Date.now() - performance.now();

  return {
    now: () => performance.now(),
    timeOrigin,
  };
}

/**
 * Returns the native Performance API implementation from Node.js. Returns undefined in old Node.js versions that don't
 * implement the API.
 */
function getNodePerformance() {
  try {
    var perfHooks = (0,_node_js__WEBPACK_IMPORTED_MODULE_1__.dynamicRequire)(module, 'perf_hooks') ;
    return perfHooks.performance;
  } catch (_) {
    return undefined;
  }
}

/**
 * The Performance API implementation for the current platform, if available.
 */
var platformPerformance = (0,_node_js__WEBPACK_IMPORTED_MODULE_1__.isNodeEnv)() ? getNodePerformance() : getBrowserPerformance();

var timestampSource =
  platformPerformance === undefined
    ? dateTimestampSource
    : {
        nowSeconds: () => (platformPerformance.timeOrigin + platformPerformance.now()) / 1000,
      };

/**
 * Returns a timestamp in seconds since the UNIX epoch using the Date API.
 */
var dateTimestampInSeconds = dateTimestampSource.nowSeconds.bind(dateTimestampSource);

/**
 * Returns a timestamp in seconds since the UNIX epoch using either the Performance or Date APIs, depending on the
 * availability of the Performance API.
 *
 * See `usingPerformanceAPI` to test whether the Performance API is used.
 *
 * BUG: Note that because of how browsers implement the Performance API, the clock might stop when the computer is
 * asleep. This creates a skew between `dateTimestampInSeconds` and `timestampInSeconds`. The
 * skew can grow to arbitrary amounts like days, weeks or months.
 * See https://github.com/getsentry/sentry-javascript/issues/2590.
 */
var timestampInSeconds = timestampSource.nowSeconds.bind(timestampSource);

// Re-exported with an old name for backwards-compatibility.
var timestampWithMs = timestampInSeconds;

/**
 * A boolean that is true when timestampInSeconds uses the Performance API to produce monotonic timestamps.
 */
var usingPerformanceAPI = platformPerformance !== undefined;

/**
 * Internal helper to store what is the source of browserPerformanceTimeOrigin below. For debugging only.
 */
let _browserPerformanceTimeOriginMode;

/**
 * The number of milliseconds since the UNIX epoch. This value is only usable in a browser, and only when the
 * performance API is available.
 */
var browserPerformanceTimeOrigin = (() => {
  // Unfortunately browsers may report an inaccurate time origin data, through either performance.timeOrigin or
  // performance.timing.navigationStart, which results in poor results in performance data. We only treat time origin
  // data as reliable if they are within a reasonable threshold of the current time.

  const { performance } = (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();
  if (!performance || !performance.now) {
    _browserPerformanceTimeOriginMode = 'none';
    return undefined;
  }

  var threshold = 3600 * 1000;
  var performanceNow = performance.now();
  var dateNow = Date.now();

  // if timeOrigin isn't available set delta to threshold so it isn't used
  var timeOriginDelta = performance.timeOrigin
    ? Math.abs(performance.timeOrigin + performanceNow - dateNow)
    : threshold;
  var timeOriginIsReliable = timeOriginDelta < threshold;

  // While performance.timing.navigationStart is deprecated in favor of performance.timeOrigin, performance.timeOrigin
  // is not as widely supported. Namely, performance.timeOrigin is undefined in Safari as of writing.
  // Also as of writing, performance.timing is not available in Web Workers in mainstream browsers, so it is not always
  // a valid fallback. In the absence of an initial time provided by the browser, fallback to the current time from the
  // Date API.
    var navigationStart = performance.timing && performance.timing.navigationStart;
  var hasNavigationStart = typeof navigationStart === 'number';
  // if navigationStart isn't available set delta to threshold so it isn't used
  var navigationStartDelta = hasNavigationStart ? Math.abs(navigationStart + performanceNow - dateNow) : threshold;
  var navigationStartIsReliable = navigationStartDelta < threshold;

  if (timeOriginIsReliable || navigationStartIsReliable) {
    // Use the more reliable time origin
    if (timeOriginDelta <= navigationStartDelta) {
      _browserPerformanceTimeOriginMode = 'timeOrigin';
      return performance.timeOrigin;
    } else {
      _browserPerformanceTimeOriginMode = 'navigationStart';
      return navigationStart;
    }
  }

  // Either both timeOrigin and navigationStart are skewed or neither is available, fallback to Date.
  _browserPerformanceTimeOriginMode = 'dateNow';
  return dateNow;
})();


//# sourceMappingURL=time.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/tracing.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TRACEPARENT_REGEXP": () => (/* binding */ TRACEPARENT_REGEXP),
/* harmony export */   "extractTraceparentData": () => (/* binding */ extractTraceparentData)
/* harmony export */ });
var TRACEPARENT_REGEXP = new RegExp(
  '^[ \\t]*' + // whitespace
    '([0-9a-f]{32})?' + // trace_id
    '-?([0-9a-f]{16})?' + // span_id
    '-?([01])?' + // sampled
    '[ \\t]*$', // whitespace
);

/**
 * Extract transaction context data from a `sentry-trace` header.
 *
 * @param traceparent Traceparent string
 *
 * @returns Object containing data from the header, or undefined if traceparent string is malformed
 */
function extractTraceparentData(traceparent) {
  var matches = traceparent.match(TRACEPARENT_REGEXP);

  if (!traceparent || !matches) {
    // empty string or no matches is invalid traceparent data
    return undefined;
  }

  let parentSampled;
  if (matches[3] === '1') {
    parentSampled = true;
  } else if (matches[3] === '0') {
    parentSampled = false;
  }

  return {
    traceId: matches[1],
    parentSampled,
    parentSpanId: matches[2],
  };
}


//# sourceMappingURL=tracing.js.map


/***/ }),

/***/ "./node_modules/@sentry/tracing/node_modules/@sentry/utils/esm/url.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getNumberOfUrlSegments": () => (/* binding */ getNumberOfUrlSegments),
/* harmony export */   "parseUrl": () => (/* binding */ parseUrl),
/* harmony export */   "stripUrlQueryAndFragment": () => (/* binding */ stripUrlQueryAndFragment)
/* harmony export */ });
/**
 * Parses string form of URL into an object
 * // borrowed from https://tools.ietf.org/html/rfc3986#appendix-B
 * // intentionally using regex and not <a/> href parsing trick because React Native and other
 * // environments where DOM might not be available
 * @returns parsed URL object
 */
function parseUrl(url)

 {
  if (!url) {
    return {};
  }

  var match = url.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);

  if (!match) {
    return {};
  }

  // coerce to undefined values to empty string so we don't get 'undefined'
  var query = match[6] || '';
  var fragment = match[8] || '';
  return {
    host: match[4],
    path: match[5],
    protocol: match[2],
    relative: match[5] + query + fragment, // everything minus origin
  };
}

/**
 * Strip the query string and fragment off of a given URL or path (if present)
 *
 * @param urlPath Full URL or path, including possible query string and/or fragment
 * @returns URL or path without query string or fragment
 */
function stripUrlQueryAndFragment(urlPath) {
    return urlPath.split(/[\?#]/, 1)[0];
}

/**
 * Returns number of URL segments of a passed string URL.
 */
function getNumberOfUrlSegments(url) {
  // split at '/' or at '\/' to split regex urls correctly
  return url.split(/\\?\//).filter(s => s.length > 0 && s !== ',').length;
}


//# sourceMappingURL=url.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/baggage.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BAGGAGE_HEADER_NAME": () => (/* binding */ BAGGAGE_HEADER_NAME),
/* harmony export */   "MAX_BAGGAGE_STRING_LENGTH": () => (/* binding */ MAX_BAGGAGE_STRING_LENGTH),
/* harmony export */   "SENTRY_BAGGAGE_KEY_PREFIX": () => (/* binding */ SENTRY_BAGGAGE_KEY_PREFIX),
/* harmony export */   "SENTRY_BAGGAGE_KEY_PREFIX_REGEX": () => (/* binding */ SENTRY_BAGGAGE_KEY_PREFIX_REGEX),
/* harmony export */   "createBaggage": () => (/* binding */ createBaggage),
/* harmony export */   "getBaggageValue": () => (/* binding */ getBaggageValue),
/* harmony export */   "getSentryBaggageItems": () => (/* binding */ getSentryBaggageItems),
/* harmony export */   "getThirdPartyBaggage": () => (/* binding */ getThirdPartyBaggage),
/* harmony export */   "isBaggageMutable": () => (/* binding */ isBaggageMutable),
/* harmony export */   "isSentryBaggageEmpty": () => (/* binding */ isSentryBaggageEmpty),
/* harmony export */   "mergeAndSerializeBaggage": () => (/* binding */ mergeAndSerializeBaggage),
/* harmony export */   "parseBaggageHeader": () => (/* binding */ parseBaggageHeader),
/* harmony export */   "parseBaggageSetMutability": () => (/* binding */ parseBaggageSetMutability),
/* harmony export */   "serializeBaggage": () => (/* binding */ serializeBaggage),
/* harmony export */   "setBaggageImmutable": () => (/* binding */ setBaggageImmutable),
/* harmony export */   "setBaggageValue": () => (/* binding */ setBaggageValue)
/* harmony export */ });
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/is.js");
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/logger.js");



var BAGGAGE_HEADER_NAME = 'baggage';

var SENTRY_BAGGAGE_KEY_PREFIX = 'sentry-';

var SENTRY_BAGGAGE_KEY_PREFIX_REGEX = /^sentry-/;

/**
 * Max length of a serialized baggage string
 *
 * https://www.w3.org/TR/baggage/#limits
 */
var MAX_BAGGAGE_STRING_LENGTH = 8192;

/** Create an instance of Baggage */
function createBaggage(initItems, baggageString = '', mutable = true) {
  return [{ ...initItems }, baggageString, mutable];
}

/** Get a value from baggage */
function getBaggageValue(baggage, key) {
  return baggage[0][key];
}

/** Add a value to baggage */
function setBaggageValue(baggage, key, value) {
  if (isBaggageMutable(baggage)) {
    baggage[0][key] = value;
  }
}

/** Check if the Sentry part of the passed baggage (i.e. the first element in the tuple) is empty */
function isSentryBaggageEmpty(baggage) {
  return Object.keys(baggage[0]).length === 0;
}

/** Returns Sentry specific baggage values */
function getSentryBaggageItems(baggage) {
  return baggage[0];
}

/**
 * Returns 3rd party baggage string of @param baggage
 * @param baggage
 */
function getThirdPartyBaggage(baggage) {
  return baggage[1];
}

/**
 * Checks if baggage is mutable
 * @param baggage
 * @returns true if baggage is mutable, else false
 */
function isBaggageMutable(baggage) {
  return baggage[2];
}

/**
 * Sets the passed baggage immutable
 * @param baggage
 */
function setBaggageImmutable(baggage) {
  baggage[2] = false;
}

/** Serialize a baggage object */
function serializeBaggage(baggage) {
  return Object.keys(baggage[0]).reduce((prev, key) => {
    var val = baggage[0][key] ;
    var baggageEntry = `${SENTRY_BAGGAGE_KEY_PREFIX}${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
    var newVal = prev === '' ? baggageEntry : `${prev},${baggageEntry}`;
    if (newVal.length > MAX_BAGGAGE_STRING_LENGTH) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
        _logger_js__WEBPACK_IMPORTED_MODULE_0__.logger.warn(`Not adding key: ${key} with val: ${val} to baggage due to exceeding baggage size limits.`);
      return prev;
    } else {
      return newVal;
    }
  }, baggage[1]);
}

/**
 * Parse a baggage header from a string or a string array and return a Baggage object
 *
 * If @param includeThirdPartyEntries is set to true, third party baggage entries are added to the Baggage object
 * (This is necessary for merging potentially pre-existing baggage headers in outgoing requests with
 * our `sentry-` values)
 */
function parseBaggageHeader(
  inputBaggageValue,
  includeThirdPartyEntries = false,
) {
  // Adding this check here because we got reports of this function failing due to the input value
  // not being a string. This debug log might help us determine what's going on here.
  if ((!Array.isArray(inputBaggageValue) && !(0,_is_js__WEBPACK_IMPORTED_MODULE_1__.isString)(inputBaggageValue)) || typeof inputBaggageValue === 'number') {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) &&
      _logger_js__WEBPACK_IMPORTED_MODULE_0__.logger.warn(
        '[parseBaggageHeader] Received input value of incompatible type: ',
        typeof inputBaggageValue,
        inputBaggageValue,
      );

    // Gonna early-return an empty baggage object so that we don't fail later on
    return createBaggage({}, '');
  }

  var baggageEntries = ((0,_is_js__WEBPACK_IMPORTED_MODULE_1__.isString)(inputBaggageValue) ? inputBaggageValue : inputBaggageValue.join(','))
    .split(',')
    .map(entry => entry.trim())
    .filter(entry => entry !== '' && (includeThirdPartyEntries || SENTRY_BAGGAGE_KEY_PREFIX_REGEX.test(entry)));

  return baggageEntries.reduce(
    ([baggageObj, baggageString], curr) => {
      const [key, val] = curr.split('=');
      if (SENTRY_BAGGAGE_KEY_PREFIX_REGEX.test(key)) {
        var baggageKey = decodeURIComponent(key.split('-')[1]);
        return [
          {
            ...baggageObj,
            [baggageKey]: decodeURIComponent(val),
          },
          baggageString,
          true,
        ];
      } else {
        return [baggageObj, baggageString === '' ? curr : `${baggageString},${curr}`, true];
      }
    },
    [{}, '', true],
  );
}

/**
 * Merges the baggage header we saved from the incoming request (or meta tag) with
 * a possibly created or modified baggage header by a third party that's been added
 * to the outgoing request header.
 *
 * In case @param headerBaggageString exists, we can safely add the the 3rd party part of @param headerBaggage
 * with our @param incomingBaggage. This is possible because if we modified anything beforehand,
 * it would only affect parts of the sentry baggage (@see Baggage interface).
 *
 * @param incomingBaggage the baggage header of the incoming request that might contain sentry entries
 * @param thirdPartyBaggageHeader possibly existing baggage header string or string[] added from a third
 *        party to the request headers
 *
 * @return a merged and serialized baggage string to be propagated with the outgoing request
 */
function mergeAndSerializeBaggage(incomingBaggage, thirdPartyBaggageHeader) {
  if (!incomingBaggage && !thirdPartyBaggageHeader) {
    return '';
  }

  var headerBaggage = (thirdPartyBaggageHeader && parseBaggageHeader(thirdPartyBaggageHeader, true)) || undefined;
  var thirdPartyHeaderBaggage = headerBaggage && getThirdPartyBaggage(headerBaggage);

  var finalBaggage = createBaggage((incomingBaggage && incomingBaggage[0]) || {}, thirdPartyHeaderBaggage || '');
  return serializeBaggage(finalBaggage);
}

/**
 * Helper function that takes a raw baggage value (if available) and the processed sentry-trace header
 * data (if available), parses the baggage value and creates a Baggage object. If there is no baggage
 * value, it will create an empty Baggage object.
 *
 * In a second step, this functions determines if the created Baggage object should be set immutable
 * to prevent mutation of the Sentry data. It does this by looking at the processed sentry-trace header.
 *
 * @param rawBaggageValue baggage value from header
 * @param sentryTraceHeader processed Sentry trace header returned from `extractTraceparentData`
 */
function parseBaggageSetMutability(
  rawBaggageValue,
  sentryTraceHeader,
) {
  var baggage = parseBaggageHeader(rawBaggageValue || '');

  // Because we are always creating a Baggage object by calling `parseBaggageHeader` above
  // (either a filled one or an empty one, even if we didn't get a `baggage` header),
  // we only need to check if we have a sentry-trace header or not. As soon as we have it,
  // we set baggage immutable. In case we don't get a sentry-trace header, we can assume that
  // this SDK is the head of the trace and thus we still permit mutation at this time.
  // There is one exception though, which is that we get a baggage-header with `sentry-`
  // items but NO sentry-trace header. In this case we also set the baggage immutable for now
  // but if something like this would ever happen, we should revisit this and determine
  // what this would actually mean for the trace (i.e. is this SDK the head?, what happened
  // before that we don't have a sentry-trace header?, etc)
  (sentryTraceHeader || !isSentryBaggageEmpty(baggage)) && setBaggageImmutable(baggage);

  return baggage;
}


//# sourceMappingURL=baggage.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/browser.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getDomElement": () => (/* binding */ getDomElement),
/* harmony export */   "getLocationHref": () => (/* binding */ getLocationHref),
/* harmony export */   "htmlTreeAsString": () => (/* binding */ htmlTreeAsString)
/* harmony export */ });
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/global.js");
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/is.js");



/**
 * Given a child DOM element, returns a query-selector statement describing that
 * and its ancestors
 * e.g. [HTMLElement] => body > div > input#foo.btn[name=baz]
 * @returns generated DOM path
 */
function htmlTreeAsString(elem, keyAttrs) {
  

  // try/catch both:
  // - accessing event.target (see getsentry/raven-js#838, #768)
  // - `htmlTreeAsString` because it's complex, and just accessing the DOM incorrectly
  // - can throw an exception in some circumstances.
  try {
    let currentElem = elem ;
    var MAX_TRAVERSE_HEIGHT = 5;
    var MAX_OUTPUT_LEN = 80;
    var out = [];
    let height = 0;
    let len = 0;
    var separator = ' > ';
    var sepLength = separator.length;
    let nextStr;

        while (currentElem && height++ < MAX_TRAVERSE_HEIGHT) {
      nextStr = _htmlElementAsString(currentElem, keyAttrs);
      // bail out if
      // - nextStr is the 'html' element
      // - the length of the string that would be created exceeds MAX_OUTPUT_LEN
      //   (ignore this limit if we are on the first iteration)
      if (nextStr === 'html' || (height > 1 && len + out.length * sepLength + nextStr.length >= MAX_OUTPUT_LEN)) {
        break;
      }

      out.push(nextStr);

      len += nextStr.length;
      currentElem = currentElem.parentNode;
    }

    return out.reverse().join(separator);
  } catch (_oO) {
    return '<unknown>';
  }
}

/**
 * Returns a simple, query-selector representation of a DOM element
 * e.g. [HTMLElement] => input#foo.btn[name=baz]
 * @returns generated DOM path
 */
function _htmlElementAsString(el, keyAttrs) {
  var elem = el 

;

  var out = [];
  let className;
  let classes;
  let key;
  let attr;
  let i;

  if (!elem || !elem.tagName) {
    return '';
  }

  out.push(elem.tagName.toLowerCase());

  // Pairs of attribute keys defined in `serializeAttribute` and their values on element.
  var keyAttrPairs =
    keyAttrs && keyAttrs.length
      ? keyAttrs.filter(keyAttr => elem.getAttribute(keyAttr)).map(keyAttr => [keyAttr, elem.getAttribute(keyAttr)])
      : null;

  if (keyAttrPairs && keyAttrPairs.length) {
    keyAttrPairs.forEach(keyAttrPair => {
      out.push(`[${keyAttrPair[0]}="${keyAttrPair[1]}"]`);
    });
  } else {
    if (elem.id) {
      out.push(`#${elem.id}`);
    }

        className = elem.className;
    if (className && (0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isString)(className)) {
      classes = className.split(/\s+/);
      for (i = 0; i < classes.length; i++) {
        out.push(`.${classes[i]}`);
      }
    }
  }
  var allowedAttrs = ['type', 'name', 'title', 'alt'];
  for (i = 0; i < allowedAttrs.length; i++) {
    key = allowedAttrs[i];
    attr = elem.getAttribute(key);
    if (attr) {
      out.push(`[${key}="${attr}"]`);
    }
  }
  return out.join('');
}

/**
 * A safe form of location.href
 */
function getLocationHref() {
  var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_1__.getGlobalObject)();
  try {
    return global.document.location.href;
  } catch (oO) {
    return '';
  }
}

/**
 * Gets a DOM element by using document.querySelector.
 *
 * This wrapper will first check for the existance of the function before
 * actually calling it so that we don't have to take care of this check,
 * every time we want to access the DOM.
 *
 * Reason: DOM/querySelector is not available in all environments.
 *
 * We have to cast to any because utils can be consumed by a variety of environments,
 * and we don't want to break TS users. If you know what element will be selected by
 * `document.querySelector`, specify it as part of the generic call. For example,
 * `var element = getDomElement<Element>('selector');`
 *
 * @param selector the selector string passed on to document.querySelector
 */
function getDomElement(selector) {
  var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_1__.getGlobalObject)();
  if (global.document && global.document.querySelector) {
    return global.document.querySelector(selector) ;
  }
  return null;
}


//# sourceMappingURL=browser.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/buildPolyfills/_nullishCoalesce.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_nullishCoalesce": () => (/* binding */ _nullishCoalesce)
/* harmony export */ });
/**
 * Polyfill for the nullish coalescing operator (`??`).
 *
 * Note that the RHS is wrapped in a function so that if it's a computed value, that evaluation won't happen unless the
 * LHS evaluates to a nullish value, to mimic the operator's short-circuiting behavior.
 *
 * Adapted from Sucrase (https://github.com/alangpierce/sucrase)
 *
 * @param lhs The value of the expression to the left of the `??`
 * @param rhsFn A function returning the value of the expression to the right of the `??`
 * @returns The LHS value, unless it's `null` or `undefined`, in which case, the RHS value
 */
function _nullishCoalesce(lhs, rhsFn) {
  // by checking for loose equality to `null`, we catch both `null` and `undefined`
  return lhs != null ? lhs : rhsFn();
}

// Sucrase version:
// function _nullishCoalesce(lhs, rhsFn) {
//   if (lhs != null) {
//     return lhs;
//   } else {
//     return rhsFn();
//   }
// }


//# sourceMappingURL=_nullishCoalesce.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_optionalChain": () => (/* binding */ _optionalChain)
/* harmony export */ });
/**
 * Polyfill for the optional chain operator, `?.`, given previous conversion of the expression into an array of values,
 * descriptors, and functions.
 *
 * Adapted from Sucrase (https://github.com/alangpierce/sucrase)
 * See https://github.com/alangpierce/sucrase/blob/265887868966917f3b924ce38dfad01fbab1329f/src/transformers/OptionalChainingNullishTransformer.ts#L15
 *
 * @param ops Array result of expression conversion
 * @returns The value of the expression
 */
function _optionalChain(ops) {
  let lastAccessLHS = undefined;
  let value = ops[0];
  let i = 1;
  while (i < ops.length) {
    var op = ops[i] ;
    var fn = ops[i + 1] ;
    i += 2;
    // by checking for loose equality to `null`, we catch both `null` and `undefined`
    if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
      // really we're meaning to return `undefined` as an actual value here, but it saves bytes not to write it
      return;
    }
    if (op === 'access' || op === 'optionalAccess') {
      lastAccessLHS = value;
      value = fn(value);
    } else if (op === 'call' || op === 'optionalCall') {
      value = fn((...args) => (value ).call(lastAccessLHS, ...args));
      lastAccessLHS = undefined;
    }
  }
  return value;
}

// Sucrase version
// function _optionalChain(ops) {
//   let lastAccessLHS = undefined;
//   let value = ops[0];
//   let i = 1;
//   while (i < ops.length) {
//     var op = ops[i];
//     var fn = ops[i + 1];
//     i += 2;
//     if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
//       return undefined;
//     }
//     if (op === 'access' || op === 'optionalAccess') {
//       lastAccessLHS = value;
//       value = fn(value);
//     } else if (op === 'call' || op === 'optionalCall') {
//       value = fn((...args) => value.call(lastAccessLHS, ...args));
//       lastAccessLHS = undefined;
//     }
//   }
//   return value;
// }


//# sourceMappingURL=_optionalChain.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/dsn.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dsnFromString": () => (/* binding */ dsnFromString),
/* harmony export */   "dsnToString": () => (/* binding */ dsnToString),
/* harmony export */   "makeDsn": () => (/* binding */ makeDsn)
/* harmony export */ });
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/error.js");


/** Regular expression used to parse a Dsn. */
var DSN_REGEX = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+))?@)([\w.-]+)(?::(\d+))?\/(.+)/;

function isValidProtocol(protocol) {
  return protocol === 'http' || protocol === 'https';
}

/**
 * Renders the string representation of this Dsn.
 *
 * By default, this will render the public representation without the password
 * component. To get the deprecated private representation, set `withPassword`
 * to true.
 *
 * @param withPassword When set to true, the password will be included.
 */
function dsnToString(dsn, withPassword = false) {
  const { host, path, pass, port, projectId, protocol, publicKey } = dsn;
  return (
    `${protocol}://${publicKey}${withPassword && pass ? `:${pass}` : ''}` +
    `@${host}${port ? `:${port}` : ''}/${path ? `${path}/` : path}${projectId}`
  );
}

/**
 * Parses a Dsn from a given string.
 *
 * @param str A Dsn as string
 * @returns Dsn as DsnComponents
 */
function dsnFromString(str) {
  var match = DSN_REGEX.exec(str);

  if (!match) {
    throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.SentryError(`Invalid Sentry Dsn: ${str}`);
  }

  const [protocol, publicKey, pass = '', host, port = '', lastPath] = match.slice(1);
  let path = '';
  let projectId = lastPath;

  var split = projectId.split('/');
  if (split.length > 1) {
    path = split.slice(0, -1).join('/');
    projectId = split.pop() ;
  }

  if (projectId) {
    var projectMatch = projectId.match(/^\d+/);
    if (projectMatch) {
      projectId = projectMatch[0];
    }
  }

  return dsnFromComponents({ host, pass, path, projectId, port, protocol: protocol , publicKey });
}

function dsnFromComponents(components) {
  return {
    protocol: components.protocol,
    publicKey: components.publicKey || '',
    pass: components.pass || '',
    host: components.host,
    port: components.port || '',
    path: components.path || '',
    projectId: components.projectId,
  };
}

function validateDsn(dsn) {
  if (!(typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__)) {
    return;
  }

  const { port, projectId, protocol } = dsn;

  var requiredComponents = ['protocol', 'publicKey', 'host', 'projectId'];
  requiredComponents.forEach(component => {
    if (!dsn[component]) {
      throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.SentryError(`Invalid Sentry Dsn: ${component} missing`);
    }
  });

  if (!projectId.match(/^\d+$/)) {
    throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.SentryError(`Invalid Sentry Dsn: Invalid projectId ${projectId}`);
  }

  if (!isValidProtocol(protocol)) {
    throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.SentryError(`Invalid Sentry Dsn: Invalid protocol ${protocol}`);
  }

  if (port && isNaN(parseInt(port, 10))) {
    throw new _error_js__WEBPACK_IMPORTED_MODULE_0__.SentryError(`Invalid Sentry Dsn: Invalid port ${port}`);
  }

  return true;
}

/** The Sentry Dsn, identifying a Sentry instance and project. */
function makeDsn(from) {
  var components = typeof from === 'string' ? dsnFromString(from) : dsnFromComponents(from);
  validateDsn(components);
  return components;
}


//# sourceMappingURL=dsn.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/env.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isBrowserBundle": () => (/* binding */ isBrowserBundle)
/* harmony export */ });
/*
 * This module exists for optimizations in the build process through rollup and terser.  We define some global
 * constants, which can be overridden during build. By guarding certain pieces of code with functions that return these
 * constants, we can control whether or not they appear in the final bundle. (Any code guarded by a false condition will
 * never run, and will hence be dropped during treeshaking.) The two primary uses for this are stripping out calls to
 * `logger` and preventing node-related code from appearing in browser bundles.
 *
 * Attention:
 * This file should not be used to define constants/flags that are intended to be used for tree-shaking conducted by
 * users. These fags should live in their respective packages, as we identified user tooling (specifically webpack)
 * having issues tree-shaking these constants across package boundaries.
 * An example for this is the __SENTRY_DEBUG__ constant. It is declared in each package individually because we want
 * users to be able to shake away expressions that it guards.
 */

/**
 * Figures out if we're building a browser bundle.
 *
 * @returns true if this is a browser bundle build.
 */
function isBrowserBundle() {
  return typeof __SENTRY_BROWSER_BUNDLE__ !== 'undefined' && !!__SENTRY_BROWSER_BUNDLE__;
}


//# sourceMappingURL=env.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/envelope.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addItemToEnvelope": () => (/* binding */ addItemToEnvelope),
/* harmony export */   "createAttachmentEnvelopeItem": () => (/* binding */ createAttachmentEnvelopeItem),
/* harmony export */   "createEnvelope": () => (/* binding */ createEnvelope),
/* harmony export */   "envelopeItemTypeToDataCategory": () => (/* binding */ envelopeItemTypeToDataCategory),
/* harmony export */   "forEachEnvelopeItem": () => (/* binding */ forEachEnvelopeItem),
/* harmony export */   "serializeEnvelope": () => (/* binding */ serializeEnvelope)
/* harmony export */ });
/* harmony import */ var _object_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/object.js");


/**
 * Creates an envelope.
 * Make sure to always explicitly provide the generic to this function
 * so that the envelope types resolve correctly.
 */
function createEnvelope(headers, items = []) {
  return [headers, items] ;
}

/**
 * Add an item to an envelope.
 * Make sure to always explicitly provide the generic to this function
 * so that the envelope types resolve correctly.
 */
function addItemToEnvelope(envelope, newItem) {
  const [headers, items] = envelope;
  return [headers, [...items, newItem]] ;
}

/**
 * Convenience function to loop through the items and item types of an envelope.
 * (This function was mostly created because working with envelope types is painful at the moment)
 */
function forEachEnvelopeItem(
  envelope,
  callback,
) {
  var envelopeItems = envelope[1];
  envelopeItems.forEach((envelopeItem) => {
    var envelopeItemType = envelopeItem[0].type;
    callback(envelopeItem, envelopeItemType);
  });
}

function encodeUTF8(input, textEncoder) {
  var utf8 = textEncoder || new TextEncoder();
  return utf8.encode(input);
}

/**
 * Serializes an envelope.
 */
function serializeEnvelope(envelope, textEncoder) {
  const [envHeaders, items] = envelope;

  // Initially we construct our envelope as a string and only convert to binary chunks if we encounter binary data
  let parts = JSON.stringify(envHeaders);

  function append(next) {
    if (typeof parts === 'string') {
      parts = typeof next === 'string' ? parts + next : [encodeUTF8(parts, textEncoder), next];
    } else {
      parts.push(typeof next === 'string' ? encodeUTF8(next, textEncoder) : next);
    }
  }

  for (var item of items) {
    const [itemHeaders, payload] = item ;
    append(`\n${JSON.stringify(itemHeaders)}\n`);
    append(typeof payload === 'string' || payload instanceof Uint8Array ? payload : JSON.stringify(payload));
  }

  return typeof parts === 'string' ? parts : concatBuffers(parts);
}

function concatBuffers(buffers) {
  var totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);

  var merged = new Uint8Array(totalLength);
  let offset = 0;
  for (var buffer of buffers) {
    merged.set(buffer, offset);
    offset += buffer.length;
  }

  return merged;
}

/**
 * Creates attachment envelope items
 */
function createAttachmentEnvelopeItem(
  attachment,
  textEncoder,
) {
  var buffer = typeof attachment.data === 'string' ? encodeUTF8(attachment.data, textEncoder) : attachment.data;

  return [
    (0,_object_js__WEBPACK_IMPORTED_MODULE_0__.dropUndefinedKeys)({
      type: 'attachment',
      length: buffer.length,
      filename: attachment.filename,
      content_type: attachment.contentType,
      attachment_type: attachment.attachmentType,
    }),
    buffer,
  ];
}

var ITEM_TYPE_TO_DATA_CATEGORY_MAP = {
  session: 'session',
  sessions: 'session',
  attachment: 'attachment',
  transaction: 'transaction',
  event: 'error',
  client_report: 'internal',
  user_report: 'default',
};

/**
 * Maps the type of an envelope item to a data category.
 */
function envelopeItemTypeToDataCategory(type) {
  return ITEM_TYPE_TO_DATA_CATEGORY_MAP[type];
}


//# sourceMappingURL=envelope.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/error.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SentryError": () => (/* binding */ SentryError)
/* harmony export */ });
/** An error emitted by Sentry SDKs and related utilities. */
class SentryError extends Error {
  /** Display name of this error instance. */
  

   constructor( message, logLevel = 'warn') {
    super(message);this.message = message;;

    this.name = new.target.prototype.constructor.name;
    // This sets the prototype to be `Error`, not `SentryError`. It's unclear why we do this, but commenting this line
    // out causes various (seemingly totally unrelated) playwright tests consistently time out. FYI, this makes
    // instances of `SentryError` fail `obj instanceof SentryError` checks.
    Object.setPrototypeOf(this, new.target.prototype);
    this.logLevel = logLevel;
  }
}


//# sourceMappingURL=error.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/global.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getGlobalObject": () => (/* binding */ getGlobalObject),
/* harmony export */   "getGlobalSingleton": () => (/* binding */ getGlobalSingleton)
/* harmony export */ });
/* harmony import */ var _node_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/node.js");


/** Internal */

var fallbackGlobalObject = {};

/**
 * Safely get global scope object
 *
 * @returns Global scope object
 */
function getGlobalObject() {
  return (
    (0,_node_js__WEBPACK_IMPORTED_MODULE_0__.isNodeEnv)()
      ? global
      : typeof window !== 'undefined'       ? window       : typeof self !== 'undefined'
      ? self
      : fallbackGlobalObject
  ) ;
}

/**
 * Returns a global singleton contained in the global `__SENTRY__` object.
 *
 * If the singleton doesn't already exist in `__SENTRY__`, it will be created using the given factory
 * function and added to the `__SENTRY__` object.
 *
 * @param name name of the global singleton on __SENTRY__
 * @param creator creator Factory function to create the singleton if it doesn't already exist on `__SENTRY__`
 * @param obj (Optional) The global object on which to look for `__SENTRY__`, if not `getGlobalObject`'s return value
 * @returns the singleton
 */
function getGlobalSingleton(name, creator, obj) {
  var global = (obj || getGlobalObject()) ;
  var __SENTRY__ = (global.__SENTRY__ = global.__SENTRY__ || {});
  var singleton = __SENTRY__[name] || (__SENTRY__[name] = creator());
  return singleton;
}


//# sourceMappingURL=global.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/is.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isDOMError": () => (/* binding */ isDOMError),
/* harmony export */   "isDOMException": () => (/* binding */ isDOMException),
/* harmony export */   "isElement": () => (/* binding */ isElement),
/* harmony export */   "isError": () => (/* binding */ isError),
/* harmony export */   "isErrorEvent": () => (/* binding */ isErrorEvent),
/* harmony export */   "isEvent": () => (/* binding */ isEvent),
/* harmony export */   "isInstanceOf": () => (/* binding */ isInstanceOf),
/* harmony export */   "isNaN": () => (/* binding */ isNaN),
/* harmony export */   "isPlainObject": () => (/* binding */ isPlainObject),
/* harmony export */   "isPrimitive": () => (/* binding */ isPrimitive),
/* harmony export */   "isRegExp": () => (/* binding */ isRegExp),
/* harmony export */   "isString": () => (/* binding */ isString),
/* harmony export */   "isSyntheticEvent": () => (/* binding */ isSyntheticEvent),
/* harmony export */   "isThenable": () => (/* binding */ isThenable)
/* harmony export */ });
var objectToString = Object.prototype.toString;

/**
 * Checks whether given value's type is one of a few Error or Error-like
 * {@link isError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isError(wat) {
  switch (objectToString.call(wat)) {
    case '[object Error]':
    case '[object Exception]':
    case '[object DOMException]':
      return true;
    default:
      return isInstanceOf(wat, Error);
  }
}
/**
 * Checks whether given value is an instance of the given built-in class.
 *
 * @param wat The value to be checked
 * @param className
 * @returns A boolean representing the result.
 */
function isBuiltin(wat, className) {
  return objectToString.call(wat) === `[object ${className}]`;
}

/**
 * Checks whether given value's type is ErrorEvent
 * {@link isErrorEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isErrorEvent(wat) {
  return isBuiltin(wat, 'ErrorEvent');
}

/**
 * Checks whether given value's type is DOMError
 * {@link isDOMError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isDOMError(wat) {
  return isBuiltin(wat, 'DOMError');
}

/**
 * Checks whether given value's type is DOMException
 * {@link isDOMException}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isDOMException(wat) {
  return isBuiltin(wat, 'DOMException');
}

/**
 * Checks whether given value's type is a string
 * {@link isString}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isString(wat) {
  return isBuiltin(wat, 'String');
}

/**
 * Checks whether given value is a primitive (undefined, null, number, boolean, string, bigint, symbol)
 * {@link isPrimitive}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isPrimitive(wat) {
  return wat === null || (typeof wat !== 'object' && typeof wat !== 'function');
}

/**
 * Checks whether given value's type is an object literal
 * {@link isPlainObject}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isPlainObject(wat) {
  return isBuiltin(wat, 'Object');
}

/**
 * Checks whether given value's type is an Event instance
 * {@link isEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isEvent(wat) {
  return typeof Event !== 'undefined' && isInstanceOf(wat, Event);
}

/**
 * Checks whether given value's type is an Element instance
 * {@link isElement}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isElement(wat) {
  return typeof Element !== 'undefined' && isInstanceOf(wat, Element);
}

/**
 * Checks whether given value's type is an regexp
 * {@link isRegExp}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isRegExp(wat) {
  return isBuiltin(wat, 'RegExp');
}

/**
 * Checks whether given value has a then function.
 * @param wat A value to be checked.
 */
function isThenable(wat) {
    return Boolean(wat && wat.then && typeof wat.then === 'function');
}

/**
 * Checks whether given value's type is a SyntheticEvent
 * {@link isSyntheticEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isSyntheticEvent(wat) {
  return isPlainObject(wat) && 'nativeEvent' in wat && 'preventDefault' in wat && 'stopPropagation' in wat;
}

/**
 * Checks whether given value is NaN
 * {@link isNaN}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isNaN(wat) {
  return typeof wat === 'number' && wat !== wat;
}

/**
 * Checks whether given value's type is an instance of provided constructor.
 * {@link isInstanceOf}.
 *
 * @param wat A value to be checked.
 * @param base A constructor to be used in a check.
 * @returns A boolean representing the result.
 */
function isInstanceOf(wat, base) {
  try {
    return wat instanceof base;
  } catch (_e) {
    return false;
  }
}


//# sourceMappingURL=is.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/logger.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CONSOLE_LEVELS": () => (/* binding */ CONSOLE_LEVELS),
/* harmony export */   "consoleSandbox": () => (/* binding */ consoleSandbox),
/* harmony export */   "logger": () => (/* binding */ logger)
/* harmony export */ });
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/global.js");


// TODO: Implement different loggers for different environments
var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();

/** Prefix for logging strings */
var PREFIX = 'Sentry Logger ';

var CONSOLE_LEVELS = ['debug', 'info', 'warn', 'error', 'log', 'assert', 'trace'] ;

/**
 * Temporarily disable sentry console instrumentations.
 *
 * @param callback The function to run against the original `console` messages
 * @returns The results of the callback
 */
function consoleSandbox(callback) {
  var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();

  if (!('console' in global)) {
    return callback();
  }

  var originalConsole = global.console ;
  var wrappedLevels = {};

  // Restore all wrapped console methods
  CONSOLE_LEVELS.forEach(level => {
    // TODO(v7): Remove this check as it's only needed for Node 6
    var originalWrappedFunc =
      originalConsole[level] && (originalConsole[level] ).__sentry_original__;
    if (level in global.console && originalWrappedFunc) {
      wrappedLevels[level] = originalConsole[level] ;
      originalConsole[level] = originalWrappedFunc ;
    }
  });

  try {
    return callback();
  } finally {
    // Revert restoration to wrapped state
    Object.keys(wrappedLevels).forEach(level => {
      originalConsole[level] = wrappedLevels[level ];
    });
  }
}

function makeLogger() {
  let enabled = false;
  var logger = {
    enable: () => {
      enabled = true;
    },
    disable: () => {
      enabled = false;
    },
  };

  if ((typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__)) {
    CONSOLE_LEVELS.forEach(name => {
            logger[name] = (...args) => {
        if (enabled) {
          consoleSandbox(() => {
            global.console[name](`${PREFIX}[${name}]:`, ...args);
          });
        }
      };
    });
  } else {
    CONSOLE_LEVELS.forEach(name => {
      logger[name] = () => undefined;
    });
  }

  return logger ;
}

// Ensure we only have a single logger instance, even if multiple versions of @sentry/utils are being used
let logger;
if ((typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__)) {
  logger = (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalSingleton)('logger', makeLogger);
} else {
  logger = makeLogger();
}


//# sourceMappingURL=logger.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/memo.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "memoBuilder": () => (/* binding */ memoBuilder)
/* harmony export */ });
/**
 * Helper to decycle json objects
 */
function memoBuilder() {
  var hasWeakSet = typeof WeakSet === 'function';
  var inner = hasWeakSet ? new WeakSet() : [];
  function memoize(obj) {
    if (hasWeakSet) {
      if (inner.has(obj)) {
        return true;
      }
      inner.add(obj);
      return false;
    }
        for (let i = 0; i < inner.length; i++) {
      var value = inner[i];
      if (value === obj) {
        return true;
      }
    }
    inner.push(obj);
    return false;
  }

  function unmemoize(obj) {
    if (hasWeakSet) {
      inner.delete(obj);
    } else {
      for (let i = 0; i < inner.length; i++) {
        if (inner[i] === obj) {
          inner.splice(i, 1);
          break;
        }
      }
    }
  }
  return [memoize, unmemoize];
}


//# sourceMappingURL=memo.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/misc.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addContextToFrame": () => (/* binding */ addContextToFrame),
/* harmony export */   "addExceptionMechanism": () => (/* binding */ addExceptionMechanism),
/* harmony export */   "addExceptionTypeValue": () => (/* binding */ addExceptionTypeValue),
/* harmony export */   "arrayify": () => (/* binding */ arrayify),
/* harmony export */   "checkOrSetAlreadyCaught": () => (/* binding */ checkOrSetAlreadyCaught),
/* harmony export */   "getEventDescription": () => (/* binding */ getEventDescription),
/* harmony export */   "parseSemver": () => (/* binding */ parseSemver),
/* harmony export */   "uuid4": () => (/* binding */ uuid4)
/* harmony export */ });
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/global.js");
/* harmony import */ var _object_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/utils/esm/object.js");
/* harmony import */ var _string_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/string.js");




/**
 * Extended Window interface that allows for Crypto API usage in IE browsers
 */

/**
 * UUID4 generator
 *
 * @returns string Generated UUID4.
 */
function uuid4() {
  var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)() ;
  var crypto = (global.crypto || global.msCrypto) ;

  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '');
  }

  var getRandomByte =
    crypto && crypto.getRandomValues ? () => crypto.getRandomValues(new Uint8Array(1))[0] : () => Math.random() * 16;

  // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
  // Concatenating the following numbers as strings results in '10000000100040008000100000000000'
  return (([1e7] ) + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, c =>
        ((c ) ^ ((getRandomByte() & 15) >> ((c ) / 4))).toString(16),
  );
}

function getFirstException(event) {
  return event.exception && event.exception.values ? event.exception.values[0] : undefined;
}

/**
 * Extracts either message or type+value from an event that can be used for user-facing logs
 * @returns event's description
 */
function getEventDescription(event) {
  const { message, event_id: eventId } = event;
  if (message) {
    return message;
  }

  var firstException = getFirstException(event);
  if (firstException) {
    if (firstException.type && firstException.value) {
      return `${firstException.type}: ${firstException.value}`;
    }
    return firstException.type || firstException.value || eventId || '<unknown>';
  }
  return eventId || '<unknown>';
}

/**
 * Adds exception values, type and value to an synthetic Exception.
 * @param event The event to modify.
 * @param value Value of the exception.
 * @param type Type of the exception.
 * @hidden
 */
function addExceptionTypeValue(event, value, type) {
  var exception = (event.exception = event.exception || {});
  var values = (exception.values = exception.values || []);
  var firstException = (values[0] = values[0] || {});
  if (!firstException.value) {
    firstException.value = value || '';
  }
  if (!firstException.type) {
    firstException.type = type || 'Error';
  }
}

/**
 * Adds exception mechanism data to a given event. Uses defaults if the second parameter is not passed.
 *
 * @param event The event to modify.
 * @param newMechanism Mechanism data to add to the event.
 * @hidden
 */
function addExceptionMechanism(event, newMechanism) {
  var firstException = getFirstException(event);
  if (!firstException) {
    return;
  }

  var defaultMechanism = { type: 'generic', handled: true };
  var currentMechanism = firstException.mechanism;
  firstException.mechanism = { ...defaultMechanism, ...currentMechanism, ...newMechanism };

  if (newMechanism && 'data' in newMechanism) {
    var mergedData = { ...(currentMechanism && currentMechanism.data), ...newMechanism.data };
    firstException.mechanism.data = mergedData;
  }
}

// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
var SEMVER_REGEXP =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

/**
 * Represents Semantic Versioning object
 */

/**
 * Parses input into a SemVer interface
 * @param input string representation of a semver version
 */
function parseSemver(input) {
  var match = input.match(SEMVER_REGEXP) || [];
  var major = parseInt(match[1], 10);
  var minor = parseInt(match[2], 10);
  var patch = parseInt(match[3], 10);
  return {
    buildmetadata: match[5],
    major: isNaN(major) ? undefined : major,
    minor: isNaN(minor) ? undefined : minor,
    patch: isNaN(patch) ? undefined : patch,
    prerelease: match[4],
  };
}

/**
 * This function adds context (pre/post/line) lines to the provided frame
 *
 * @param lines string[] containing all lines
 * @param frame StackFrame that will be mutated
 * @param linesOfContext number of context lines we want to add pre/post
 */
function addContextToFrame(lines, frame, linesOfContext = 5) {
  var lineno = frame.lineno || 0;
  var maxLines = lines.length;
  var sourceLine = Math.max(Math.min(maxLines, lineno - 1), 0);

  frame.pre_context = lines
    .slice(Math.max(0, sourceLine - linesOfContext), sourceLine)
    .map((line) => (0,_string_js__WEBPACK_IMPORTED_MODULE_1__.snipLine)(line, 0));

  frame.context_line = (0,_string_js__WEBPACK_IMPORTED_MODULE_1__.snipLine)(lines[Math.min(maxLines - 1, sourceLine)], frame.colno || 0);

  frame.post_context = lines
    .slice(Math.min(sourceLine + 1, maxLines), sourceLine + 1 + linesOfContext)
    .map((line) => (0,_string_js__WEBPACK_IMPORTED_MODULE_1__.snipLine)(line, 0));
}

/**
 * Checks whether or not we've already captured the given exception (note: not an identical exception - the very object
 * in question), and marks it captured if not.
 *
 * This is useful because it's possible for an error to get captured by more than one mechanism. After we intercept and
 * record an error, we rethrow it (assuming we've intercepted it before it's reached the top-level global handlers), so
 * that we don't interfere with whatever effects the error might have had were the SDK not there. At that point, because
 * the error has been rethrown, it's possible for it to bubble up to some other code we've instrumented. If it's not
 * caught after that, it will bubble all the way up to the global handlers (which of course we also instrument). This
 * function helps us ensure that even if we encounter the same error more than once, we only record it the first time we
 * see it.
 *
 * Note: It will ignore primitives (always return `false` and not mark them as seen), as properties can't be set on
 * them. {@link: Object.objectify} can be used on exceptions to convert any that are primitives into their equivalent
 * object wrapper forms so that this check will always work. However, because we need to flag the exact object which
 * will get rethrown, and because that rethrowing happens outside of the event processing pipeline, the objectification
 * must be done before the exception captured.
 *
 * @param A thrown exception to check or flag as having been seen
 * @returns `true` if the exception has already been captured, `false` if not (with the side effect of marking it seen)
 */
function checkOrSetAlreadyCaught(exception) {
    if (exception && (exception ).__sentry_captured__) {
    return true;
  }

  try {
    // set it this way rather than by assignment so that it's not ennumerable and therefore isn't recorded by the
    // `ExtraErrorData` integration
    (0,_object_js__WEBPACK_IMPORTED_MODULE_2__.addNonEnumerableProperty)(exception , '__sentry_captured__', true);
  } catch (err) {
    // `exception` is a primitive, so we can't mark it seen
  }

  return false;
}

/**
 * Checks whether the given input is already an array, and if it isn't, wraps it in one.
 *
 * @param maybeArray Input to turn into an array, if necessary
 * @returns The input, if already an array, or an array with the input as the only element, if not
 */
function arrayify(maybeArray) {
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
}


//# sourceMappingURL=misc.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/node.js":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dynamicRequire": () => (/* binding */ dynamicRequire),
/* harmony export */   "isNodeEnv": () => (/* binding */ isNodeEnv),
/* harmony export */   "loadModule": () => (/* binding */ loadModule)
/* harmony export */ });
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/env.js");
/* module decorator */ module = __webpack_require__.hmd(module);


/**
 * NOTE: In order to avoid circular dependencies, if you add a function to this module and it needs to print something,
 * you must either a) use `console.log` rather than the logger, or b) put your function elsewhere.
 */

/**
 * Checks whether we're in the Node.js or Browser environment
 *
 * @returns Answer to given question
 */
function isNodeEnv() {
  // explicitly check for browser bundles as those can be optimized statically
  // by terser/rollup.
  return (
    !(0,_env_js__WEBPACK_IMPORTED_MODULE_0__.isBrowserBundle)() &&
    Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]'
  );
}

/**
 * Requires a module which is protected against bundler minification.
 *
 * @param request The module path to resolve
 */
function dynamicRequire(mod, request) {
    return mod.require(request);
}

/**
 * Helper for dynamically loading module that should work with linked dependencies.
 * The problem is that we _should_ be using `require(require.resolve(moduleName, { paths: [cwd()] }))`
 * However it's _not possible_ to do that with Webpack, as it has to know all the dependencies during
 * build time. `require.resolve` is also not available in any other way, so we cannot create,
 * a fake helper like we do with `dynamicRequire`.
 *
 * We always prefer to use local package, thus the value is not returned early from each `try/catch` block.
 * That is to mimic the behavior of `require.resolve` exactly.
 *
 * @param moduleName module name to require
 * @returns possibly required module
 */
function loadModule(moduleName) {
  let mod;

  try {
    mod = dynamicRequire(module, moduleName);
  } catch (e) {
    // no-empty
  }

  try {
    const { cwd } = dynamicRequire(module, 'process');
    mod = dynamicRequire(module, `${cwd()}/node_modules/${moduleName}`) ;
  } catch (e) {
    // no-empty
  }

  return mod;
}


//# sourceMappingURL=node.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/normalize.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "normalize": () => (/* binding */ normalize),
/* harmony export */   "normalizeToSize": () => (/* binding */ normalizeToSize),
/* harmony export */   "walk": () => (/* binding */ visit)
/* harmony export */ });
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/is.js");
/* harmony import */ var _memo_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/memo.js");
/* harmony import */ var _object_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/utils/esm/object.js");
/* harmony import */ var _stacktrace_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/utils/esm/stacktrace.js");





/**
 * Recursively normalizes the given object.
 *
 * - Creates a copy to prevent original input mutation
 * - Skips non-enumerable properties
 * - When stringifying, calls `toJSON` if implemented
 * - Removes circular references
 * - Translates non-serializable values (`undefined`/`NaN`/functions) to serializable format
 * - Translates known global objects/classes to a string representations
 * - Takes care of `Error` object serialization
 * - Optionally limits depth of final output
 * - Optionally limits number of properties/elements included in any single object/array
 *
 * @param input The object to be normalized.
 * @param depth The max depth to which to normalize the object. (Anything deeper stringified whole.)
 * @param maxProperties The max number of elements or properties to be included in any single array or
 * object in the normallized output.
 * @returns A normalized version of the object, or `"**non-serializable**"` if any errors are thrown during normalization.
 */
function normalize(input, depth = +Infinity, maxProperties = +Infinity) {
  try {
    // since we're at the outermost level, we don't provide a key
    return visit('', input, depth, maxProperties);
  } catch (err) {
    return { ERROR: `**non-serializable** (${err})` };
  }
}

/** JSDoc */
function normalizeToSize(
    object,
  // Default Node.js REPL depth
  depth = 3,
  // 100kB, as 200kB is max payload size, so half sounds reasonable
  maxSize = 100 * 1024,
) {
  var normalized = normalize(object, depth);

  if (jsonSize(normalized) > maxSize) {
    return normalizeToSize(object, depth - 1, maxSize);
  }

  return normalized ;
}

/**
 * Visits a node to perform normalization on it
 *
 * @param key The key corresponding to the given node
 * @param value The node to be visited
 * @param depth Optional number indicating the maximum recursion depth
 * @param maxProperties Optional maximum number of properties/elements included in any single object/array
 * @param memo Optional Memo class handling decycling
 */
function visit(
  key,
  value,
  depth = +Infinity,
  maxProperties = +Infinity,
  memo = (0,_memo_js__WEBPACK_IMPORTED_MODULE_0__.memoBuilder)(),
) {
  const [memoize, unmemoize] = memo;

  // Get the simple cases out of the way first
  if (value === null || (['number', 'boolean', 'string'].includes(typeof value) && !(0,_is_js__WEBPACK_IMPORTED_MODULE_1__.isNaN)(value))) {
    return value ;
  }

  var stringified = stringifyValue(key, value);

  // Anything we could potentially dig into more (objects or arrays) will have come back as `"[object XXXX]"`.
  // Everything else will have already been serialized, so if we don't see that pattern, we're done.
  if (!stringified.startsWith('[object ')) {
    return stringified;
  }

  // From here on, we can assert that `value` is either an object or an array.

  // Do not normalize objects that we know have already been normalized. As a general rule, the
  // "__sentry_skip_normalization__" property should only be used sparingly and only should only be set on objects that
  // have already been normalized.
  if ((value )['__sentry_skip_normalization__']) {
    return value ;
  }

  // We're also done if we've reached the max depth
  if (depth === 0) {
    // At this point we know `serialized` is a string of the form `"[object XXXX]"`. Clean it up so it's just `"[XXXX]"`.
    return stringified.replace('object ', '');
  }

  // If we've already visited this branch, bail out, as it's circular reference. If not, note that we're seeing it now.
  if (memoize(value)) {
    return '[Circular ~]';
  }

  // If the value has a `toJSON` method, we call it to extract more information
  var valueWithToJSON = value ;
  if (valueWithToJSON && typeof valueWithToJSON.toJSON === 'function') {
    try {
      var jsonValue = valueWithToJSON.toJSON();
      // We need to normalize the return value of `.toJSON()` in case it has circular references
      return visit('', jsonValue, depth - 1, maxProperties, memo);
    } catch (err) {
      // pass (The built-in `toJSON` failed, but we can still try to do it ourselves)
    }
  }

  // At this point we know we either have an object or an array, we haven't seen it before, and we're going to recurse
  // because we haven't yet reached the max depth. Create an accumulator to hold the results of visiting each
  // property/entry, and keep track of the number of items we add to it.
  var normalized = (Array.isArray(value) ? [] : {}) ;
  let numAdded = 0;

  // Before we begin, convert`Error` and`Event` instances into plain objects, since some of each of their relevant
  // properties are non-enumerable and otherwise would get missed.
  var visitable = (0,_object_js__WEBPACK_IMPORTED_MODULE_2__.convertToPlainObject)(value );

  for (var visitKey in visitable) {
    // Avoid iterating over fields in the prototype if they've somehow been exposed to enumeration.
    if (!Object.prototype.hasOwnProperty.call(visitable, visitKey)) {
      continue;
    }

    if (numAdded >= maxProperties) {
      normalized[visitKey] = '[MaxProperties ~]';
      break;
    }

    // Recursively visit all the child nodes
    var visitValue = visitable[visitKey];
    normalized[visitKey] = visit(visitKey, visitValue, depth - 1, maxProperties, memo);

    numAdded += 1;
  }

  // Once we've visited all the branches, remove the parent from memo storage
  unmemoize(value);

  // Return accumulated values
  return normalized;
}

/**
 * Stringify the given value. Handles various known special values and types.
 *
 * Not meant to be used on simple primitives which already have a string representation, as it will, for example, turn
 * the number 1231 into "[Object Number]", nor on `null`, as it will throw.
 *
 * @param value The value to stringify
 * @returns A stringified representation of the given value
 */
function stringifyValue(
  key,
  // this type is a tiny bit of a cheat, since this function does handle NaN (which is technically a number), but for
  // our internal use, it'll do
  value,
) {
  try {
    if (key === 'domain' && value && typeof value === 'object' && (value )._events) {
      return '[Domain]';
    }

    if (key === 'domainEmitter') {
      return '[DomainEmitter]';
    }

    // It's safe to use `global`, `window`, and `document` here in this manner, as we are asserting using `typeof` first
    // which won't throw if they are not present.

    if (typeof global !== 'undefined' && value === global) {
      return '[Global]';
    }

        if (typeof window !== 'undefined' && value === window) {
      return '[Window]';
    }

        if (typeof document !== 'undefined' && value === document) {
      return '[Document]';
    }

    // React's SyntheticEvent thingy
    if ((0,_is_js__WEBPACK_IMPORTED_MODULE_1__.isSyntheticEvent)(value)) {
      return '[SyntheticEvent]';
    }

    if (typeof value === 'number' && value !== value) {
      return '[NaN]';
    }

    // this catches `undefined` (but not `null`, which is a primitive and can be serialized on its own)
    if (value === void 0) {
      return '[undefined]';
    }

    if (typeof value === 'function') {
      return `[Function: ${(0,_stacktrace_js__WEBPACK_IMPORTED_MODULE_3__.getFunctionName)(value)}]`;
    }

    if (typeof value === 'symbol') {
      return `[${String(value)}]`;
    }

    // stringified BigInts are indistinguishable from regular numbers, so we need to label them to avoid confusion
    if (typeof value === 'bigint') {
      return `[BigInt: ${String(value)}]`;
    }

    // Now that we've knocked out all the special cases and the primitives, all we have left are objects. Simply casting
    // them to strings means that instances of classes which haven't defined their `toStringTag` will just come out as
    // `"[object Object]"`. If we instead look at the constructor's name (which is the same as the name of the class),
    // we can make sure that only plain objects come out that way.
    return `[object ${(Object.getPrototypeOf(value) ).constructor.name}]`;
  } catch (err) {
    return `**non-serializable** (${err})`;
  }
}

/** Calculates bytes size of input string */
function utf8Length(value) {
    return ~-encodeURI(value).split(/%..|./).length;
}

/** Calculates bytes size of input object */
function jsonSize(value) {
  return utf8Length(JSON.stringify(value));
}


//# sourceMappingURL=normalize.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/object.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addNonEnumerableProperty": () => (/* binding */ addNonEnumerableProperty),
/* harmony export */   "convertToPlainObject": () => (/* binding */ convertToPlainObject),
/* harmony export */   "dropUndefinedKeys": () => (/* binding */ dropUndefinedKeys),
/* harmony export */   "extractExceptionKeysForMessage": () => (/* binding */ extractExceptionKeysForMessage),
/* harmony export */   "fill": () => (/* binding */ fill),
/* harmony export */   "getOriginalFunction": () => (/* binding */ getOriginalFunction),
/* harmony export */   "markFunctionWrapped": () => (/* binding */ markFunctionWrapped),
/* harmony export */   "objectify": () => (/* binding */ objectify),
/* harmony export */   "urlEncode": () => (/* binding */ urlEncode)
/* harmony export */ });
/* harmony import */ var _browser_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/browser.js");
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/is.js");
/* harmony import */ var _string_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/utils/esm/string.js");




/**
 * Replace a method in an object with a wrapped version of itself.
 *
 * @param source An object that contains a method to be wrapped.
 * @param name The name of the method to be wrapped.
 * @param replacementFactory A higher-order function that takes the original version of the given method and returns a
 * wrapped version. Note: The function returned by `replacementFactory` needs to be a non-arrow function, in order to
 * preserve the correct value of `this`, and the original method must be called using `origMethod.call(this, <other
 * args>)` or `origMethod.apply(this, [<other args>])` (rather than being called directly), again to preserve `this`.
 * @returns void
 */
function fill(source, name, replacementFactory) {
  if (!(name in source)) {
    return;
  }

  var original = source[name] ;
  var wrapped = replacementFactory(original) ;

  // Make sure it's a function first, as we need to attach an empty prototype for `defineProperties` to work
  // otherwise it'll throw "TypeError: Object.defineProperties called on non-object"
  if (typeof wrapped === 'function') {
    try {
      markFunctionWrapped(wrapped, original);
    } catch (_Oo) {
      // This can throw if multiple fill happens on a global object like XMLHttpRequest
      // Fixes https://github.com/getsentry/sentry-javascript/issues/2043
    }
  }

  source[name] = wrapped;
}

/**
 * Defines a non-enumerable property on the given object.
 *
 * @param obj The object on which to set the property
 * @param name The name of the property to be set
 * @param value The value to which to set the property
 */
function addNonEnumerableProperty(obj, name, value) {
  Object.defineProperty(obj, name, {
    // enumerable: false, // the default, so we can save on bundle size by not explicitly setting it
    value: value,
    writable: true,
    configurable: true,
  });
}

/**
 * Remembers the original function on the wrapped function and
 * patches up the prototype.
 *
 * @param wrapped the wrapper function
 * @param original the original function that gets wrapped
 */
function markFunctionWrapped(wrapped, original) {
  var proto = original.prototype || {};
  wrapped.prototype = original.prototype = proto;
  addNonEnumerableProperty(wrapped, '__sentry_original__', original);
}

/**
 * This extracts the original function if available.  See
 * `markFunctionWrapped` for more information.
 *
 * @param func the function to unwrap
 * @returns the unwrapped version of the function if available.
 */
function getOriginalFunction(func) {
  return func.__sentry_original__;
}

/**
 * Encodes given object into url-friendly format
 *
 * @param object An object that contains serializable values
 * @returns string Encoded
 */
function urlEncode(object) {
  return Object.keys(object)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`)
    .join('&');
}

/**
 * Transforms any `Error` or `Event` into a plain object with all of their enumerable properties, and some of their
 * non-enumerable properties attached.
 *
 * @param value Initial source that we have to transform in order for it to be usable by the serializer
 * @returns An Event or Error turned into an object - or the value argurment itself, when value is neither an Event nor
 *  an Error.
 */
function convertToPlainObject(
  value,
)

 {
  if ((0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isError)(value)) {
    return {
      message: value.message,
      name: value.name,
      stack: value.stack,
      ...getOwnProperties(value),
    };
  } else if ((0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isEvent)(value)) {
    var newObj

 = {
      type: value.type,
      target: serializeEventTarget(value.target),
      currentTarget: serializeEventTarget(value.currentTarget),
      ...getOwnProperties(value),
    };

    if (typeof CustomEvent !== 'undefined' && (0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isInstanceOf)(value, CustomEvent)) {
      newObj.detail = value.detail;
    }

    return newObj;
  } else {
    return value;
  }
}

/** Creates a string representation of the target of an `Event` object */
function serializeEventTarget(target) {
  try {
    return (0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(target) ? (0,_browser_js__WEBPACK_IMPORTED_MODULE_1__.htmlTreeAsString)(target) : Object.prototype.toString.call(target);
  } catch (_oO) {
    return '<unknown>';
  }
}

/** Filters out all but an object's own properties */
function getOwnProperties(obj) {
  if (typeof obj === 'object' && obj !== null) {
    var extractedProps = {};
    for (var property in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, property)) {
        extractedProps[property] = (obj )[property];
      }
    }
    return extractedProps;
  } else {
    return {};
  }
}

/**
 * Given any captured exception, extract its keys and create a sorted
 * and truncated list that will be used inside the event message.
 * eg. `Non-error exception captured with keys: foo, bar, baz`
 */
function extractExceptionKeysForMessage(exception, maxLength = 40) {
  var keys = Object.keys(convertToPlainObject(exception));
  keys.sort();

  if (!keys.length) {
    return '[object has no keys]';
  }

  if (keys[0].length >= maxLength) {
    return (0,_string_js__WEBPACK_IMPORTED_MODULE_2__.truncate)(keys[0], maxLength);
  }

  for (let includedKeys = keys.length; includedKeys > 0; includedKeys--) {
    var serialized = keys.slice(0, includedKeys).join(', ');
    if (serialized.length > maxLength) {
      continue;
    }
    if (includedKeys === keys.length) {
      return serialized;
    }
    return (0,_string_js__WEBPACK_IMPORTED_MODULE_2__.truncate)(serialized, maxLength);
  }

  return '';
}

/**
 * Given any object, return a new object having removed all fields whose value was `undefined`.
 * Works recursively on objects and arrays.
 *
 * Attention: This function keeps circular references in the returned object.
 */
function dropUndefinedKeys(inputValue) {
  // This map keeps track of what already visited nodes map to.
  // Our Set - based memoBuilder doesn't work here because we want to the output object to have the same circular
  // references as the input object.
  var memoizationMap = new Map();

  // This function just proxies `_dropUndefinedKeys` to keep the `memoBuilder` out of this function's API
  return _dropUndefinedKeys(inputValue, memoizationMap);
}

function _dropUndefinedKeys(inputValue, memoizationMap) {
  if ((0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(inputValue)) {
    // If this node has already been visited due to a circular reference, return the object it was mapped to in the new object
    var memoVal = memoizationMap.get(inputValue);
    if (memoVal !== undefined) {
      return memoVal ;
    }

    var returnValue = {};
    // Store the mapping of this value in case we visit it again, in case of circular data
    memoizationMap.set(inputValue, returnValue);

    for (var key of Object.keys(inputValue)) {
      if (typeof inputValue[key] !== 'undefined') {
        returnValue[key] = _dropUndefinedKeys(inputValue[key], memoizationMap);
      }
    }

    return returnValue ;
  }

  if (Array.isArray(inputValue)) {
    // If this node has already been visited due to a circular reference, return the array it was mapped to in the new object
    var memoVal = memoizationMap.get(inputValue);
    if (memoVal !== undefined) {
      return memoVal ;
    }

    var returnValue = [];
    // Store the mapping of this value in case we visit it again, in case of circular data
    memoizationMap.set(inputValue, returnValue);

    inputValue.forEach((item) => {
      returnValue.push(_dropUndefinedKeys(item, memoizationMap));
    });

    return returnValue ;
  }

  return inputValue;
}

/**
 * Ensure that something is an object.
 *
 * Turns `undefined` and `null` into `String`s and all other primitives into instances of their respective wrapper
 * classes (String, Boolean, Number, etc.). Acts as the identity function on non-primitives.
 *
 * @param wat The subject of the objectification
 * @returns A version of `wat` which can safely be used with `Object` class methods
 */
function objectify(wat) {
  let objectified;
  switch (true) {
    case wat === undefined || wat === null:
      objectified = new String(wat);
      break;

    // Though symbols and bigints do have wrapper classes (`Symbol` and `BigInt`, respectively), for whatever reason
    // those classes don't have constructors which can be used with the `new` keyword. We therefore need to cast each as
    // an object in order to wrap it.
    case typeof wat === 'symbol' || typeof wat === 'bigint':
      objectified = Object(wat);
      break;

    // this will catch the remaining primitives: `String`, `Number`, and `Boolean`
    case (0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isPrimitive)(wat):
            objectified = new (wat ).constructor(wat);
      break;

    // by process of elimination, at this point we know that `wat` must already be an object
    default:
      objectified = wat;
      break;
  }
  return objectified;
}


//# sourceMappingURL=object.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/path.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "basename": () => (/* binding */ basename),
/* harmony export */   "dirname": () => (/* binding */ dirname),
/* harmony export */   "isAbsolute": () => (/* binding */ isAbsolute),
/* harmony export */   "join": () => (/* binding */ join),
/* harmony export */   "normalizePath": () => (/* binding */ normalizePath),
/* harmony export */   "relative": () => (/* binding */ relative),
/* harmony export */   "resolve": () => (/* binding */ resolve)
/* harmony export */ });
// Slightly modified (no IE8 support, ES6) and transcribed to TypeScript
// https://raw.githubusercontent.com/calvinmetcalf/rollup-plugin-node-builtins/master/src/es6/path.js

/** JSDoc */
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  let up = 0;
  for (let i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
            up++;
    } else if (up) {
      parts.splice(i, 1);
            up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
        for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^/]+?|)(\.[^./]*|))(?:[/]*)$/;
/** JSDoc */
function splitPath(filename) {
  var parts = splitPathRe.exec(filename);
  return parts ? parts.slice(1) : [];
}

// path.resolve([from ...], to)
// posix version
/** JSDoc */
function resolve(...args) {
  let resolvedPath = '';
  let resolvedAbsolute = false;

  for (let i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = i >= 0 ? args[i] : '/';

    // Skip empty entries
    if (!path) {
      continue;
    }

    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(
    resolvedPath.split('/').filter(p => !!p),
    !resolvedAbsolute,
  ).join('/');

  return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
}

/** JSDoc */
function trim(arr) {
  let start = 0;
  for (; start < arr.length; start++) {
    if (arr[start] !== '') {
      break;
    }
  }

  let end = arr.length - 1;
  for (; end >= 0; end--) {
    if (arr[end] !== '') {
      break;
    }
  }

  if (start > end) {
    return [];
  }
  return arr.slice(start, end - start + 1);
}

// path.relative(from, to)
// posix version
/** JSDoc */
function relative(from, to) {
    from = resolve(from).substr(1);
  to = resolve(to).substr(1);
  
  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  let samePartsLength = length;
  for (let i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  let outputParts = [];
  for (let i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
}

// path.normalize(path)
// posix version
/** JSDoc */
function normalizePath(path) {
  var isPathAbsolute = isAbsolute(path);
  var trailingSlash = path.substr(-1) === '/';

  // Normalize the path
  let normalizedPath = normalizeArray(
    path.split('/').filter(p => !!p),
    !isPathAbsolute,
  ).join('/');

  if (!normalizedPath && !isPathAbsolute) {
    normalizedPath = '.';
  }
  if (normalizedPath && trailingSlash) {
    normalizedPath += '/';
  }

  return (isPathAbsolute ? '/' : '') + normalizedPath;
}

// posix version
/** JSDoc */
function isAbsolute(path) {
  return path.charAt(0) === '/';
}

// posix version
/** JSDoc */
function join(...args) {
  return normalizePath(args.join('/'));
}

/** JSDoc */
function dirname(path) {
  var result = splitPath(path);
  var root = result[0];
  let dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
}

/** JSDoc */
function basename(path, ext) {
  let f = splitPath(path)[2];
  if (ext && f.substr(ext.length * -1) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
}


//# sourceMappingURL=path.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/promisebuffer.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "makePromiseBuffer": () => (/* binding */ makePromiseBuffer)
/* harmony export */ });
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/error.js");
/* harmony import */ var _syncpromise_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/syncpromise.js");



/**
 * Creates an new PromiseBuffer object with the specified limit
 * @param limit max number of promises that can be stored in the buffer
 */
function makePromiseBuffer(limit) {
  var buffer = [];

  function isReady() {
    return limit === undefined || buffer.length < limit;
  }

  /**
   * Remove a promise from the queue.
   *
   * @param task Can be any PromiseLike<T>
   * @returns Removed promise.
   */
  function remove(task) {
    return buffer.splice(buffer.indexOf(task), 1)[0];
  }

  /**
   * Add a promise (representing an in-flight action) to the queue, and set it to remove itself on fulfillment.
   *
   * @param taskProducer A function producing any PromiseLike<T>; In previous versions this used to be `task:
   *        PromiseLike<T>`, but under that model, Promises were instantly created on the call-site and their executor
   *        functions therefore ran immediately. Thus, even if the buffer was full, the action still happened. By
   *        requiring the promise to be wrapped in a function, we can defer promise creation until after the buffer
   *        limit check.
   * @returns The original promise.
   */
  function add(taskProducer) {
    if (!isReady()) {
      return (0,_syncpromise_js__WEBPACK_IMPORTED_MODULE_0__.rejectedSyncPromise)(new _error_js__WEBPACK_IMPORTED_MODULE_1__.SentryError('Not adding Promise because buffer limit was reached.'));
    }

    // start the task and add its promise to the queue
    var task = taskProducer();
    if (buffer.indexOf(task) === -1) {
      buffer.push(task);
    }
    void task
      .then(() => remove(task))
      // Use `then(null, rejectionHandler)` rather than `catch(rejectionHandler)` so that we can use `PromiseLike`
      // rather than `Promise`. `PromiseLike` doesn't have a `.catch` method, making its polyfill smaller. (ES5 didn't
      // have promises, so TS has to polyfill when down-compiling.)
      .then(null, () =>
        remove(task).then(null, () => {
          // We have to add another catch here because `remove()` starts a new promise chain.
        }),
      );
    return task;
  }

  /**
   * Wait for all promises in the queue to resolve or for timeout to expire, whichever comes first.
   *
   * @param timeout The time, in ms, after which to resolve to `false` if the queue is still non-empty. Passing `0` (or
   * not passing anything) will make the promise wait as long as it takes for the queue to drain before resolving to
   * `true`.
   * @returns A promise which will resolve to `true` if the queue is already empty or drains before the timeout, and
   * `false` otherwise
   */
  function drain(timeout) {
    return new _syncpromise_js__WEBPACK_IMPORTED_MODULE_0__.SyncPromise((resolve, reject) => {
      let counter = buffer.length;

      if (!counter) {
        return resolve(true);
      }

      // wait for `timeout` ms and then resolve to `false` (if not cancelled first)
      var capturedSetTimeout = setTimeout(() => {
        if (timeout && timeout > 0) {
          resolve(false);
        }
      }, timeout);

      // if all promises resolve in time, cancel the timer and resolve to `true`
      buffer.forEach(item => {
        void (0,_syncpromise_js__WEBPACK_IMPORTED_MODULE_0__.resolvedSyncPromise)(item).then(() => {
                    if (!--counter) {
            clearTimeout(capturedSetTimeout);
            resolve(true);
          }
        }, reject);
      });
    });
  }

  return {
    $: buffer,
    add,
    drain,
  };
}


//# sourceMappingURL=promisebuffer.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/ratelimit.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DEFAULT_RETRY_AFTER": () => (/* binding */ DEFAULT_RETRY_AFTER),
/* harmony export */   "disabledUntil": () => (/* binding */ disabledUntil),
/* harmony export */   "isRateLimited": () => (/* binding */ isRateLimited),
/* harmony export */   "parseRetryAfterHeader": () => (/* binding */ parseRetryAfterHeader),
/* harmony export */   "updateRateLimits": () => (/* binding */ updateRateLimits)
/* harmony export */ });
// Intentionally keeping the key broad, as we don't know for sure what rate limit headers get returned from backend

var DEFAULT_RETRY_AFTER = 60 * 1000; // 60 seconds

/**
 * Extracts Retry-After value from the request header or returns default value
 * @param header string representation of 'Retry-After' header
 * @param now current unix timestamp
 *
 */
function parseRetryAfterHeader(header, now = Date.now()) {
  var headerDelay = parseInt(`${header}`, 10);
  if (!isNaN(headerDelay)) {
    return headerDelay * 1000;
  }

  var headerDate = Date.parse(`${header}`);
  if (!isNaN(headerDate)) {
    return headerDate - now;
  }

  return DEFAULT_RETRY_AFTER;
}

/**
 * Gets the time that given category is disabled until for rate limiting
 */
function disabledUntil(limits, category) {
  return limits[category] || limits.all || 0;
}

/**
 * Checks if a category is rate limited
 */
function isRateLimited(limits, category, now = Date.now()) {
  return disabledUntil(limits, category) > now;
}

/**
 * Update ratelimits from incoming headers.
 * Returns true if headers contains a non-empty rate limiting header.
 */
function updateRateLimits(
  limits,
  { statusCode, headers },
  now = Date.now(),
) {
  var updatedRateLimits = {
    ...limits,
  };

  // "The name is case-insensitive."
  // https://developer.mozilla.org/en-US/docs/Web/API/Headers/get
  var rateLimitHeader = headers && headers['x-sentry-rate-limits'];
  var retryAfterHeader = headers && headers['retry-after'];

  if (rateLimitHeader) {
    /**
     * rate limit headers are of the form
     *     <header>,<header>,..
     * where each <header> is of the form
     *     <retry_after>: <categories>: <scope>: <reason_code>
     * where
     *     <retry_after> is a delay in seconds
     *     <categories> is the event type(s) (error, transaction, etc) being rate limited and is of the form
     *         <category>;<category>;...
     *     <scope> is what's being limited (org, project, or key) - ignored by SDK
     *     <reason_code> is an arbitrary string like "org_quota" - ignored by SDK
     */
    for (var limit of rateLimitHeader.trim().split(',')) {
      const [retryAfter, categories] = limit.split(':', 2);
      var headerDelay = parseInt(retryAfter, 10);
      var delay = (!isNaN(headerDelay) ? headerDelay : 60) * 1000; // 60sec default
      if (!categories) {
        updatedRateLimits.all = now + delay;
      } else {
        for (var category of categories.split(';')) {
          updatedRateLimits[category] = now + delay;
        }
      }
    }
  } else if (retryAfterHeader) {
    updatedRateLimits.all = now + parseRetryAfterHeader(retryAfterHeader, now);
  } else if (statusCode === 429) {
    updatedRateLimits.all = now + 60 * 1000;
  }

  return updatedRateLimits;
}


//# sourceMappingURL=ratelimit.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/requestdata.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addRequestDataToEvent": () => (/* binding */ addRequestDataToEvent),
/* harmony export */   "addRequestDataToTransaction": () => (/* binding */ addRequestDataToTransaction),
/* harmony export */   "extractPathForTransaction": () => (/* binding */ extractPathForTransaction),
/* harmony export */   "extractRequestData": () => (/* binding */ extractRequestData)
/* harmony export */ });
/* harmony import */ var _buildPolyfills__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/is.js");
/* harmony import */ var _normalize_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./node_modules/@sentry/utils/esm/normalize.js");
/* harmony import */ var _url_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/url.js");





var DEFAULT_INCLUDES = {
  ip: false,
  request: true,
  transaction: true,
  user: true,
};
var DEFAULT_REQUEST_INCLUDES = ['cookies', 'data', 'headers', 'method', 'query_string', 'url'];
var DEFAULT_USER_INCLUDES = ['id', 'username', 'email'];

/**
 * Sets parameterized route as transaction name e.g.: `GET /users/:id`
 * Also adds more context data on the transaction from the request
 */
function addRequestDataToTransaction(
  transaction,
  req,
  deps,
) {
  if (!transaction) return;
  if (!transaction.metadata.source || transaction.metadata.source === 'url') {
    // Attempt to grab a parameterized route off of the request
    transaction.setName(...extractPathForTransaction(req, { path: true, method: true }));
  }
  transaction.setData('url', req.originalUrl || req.url);
  if (req.baseUrl) {
    transaction.setData('baseUrl', req.baseUrl);
  }
  transaction.setData('query', extractQueryParams(req, deps));
}

/**
 * Extracts a complete and parameterized path from the request object and uses it to construct transaction name.
 * If the parameterized transaction name cannot be extracted, we fall back to the raw URL.
 *
 * Additionally, this function determines and returns the transaction name source
 *
 * eg. GET /mountpoint/user/:id
 *
 * @param req A request object
 * @param options What to include in the transaction name (method, path, or a custom route name to be
 *                used instead of the request's route)
 *
 * @returns A tuple of the fully constructed transaction name [0] and its source [1] (can be either 'route' or 'url')
 */
function extractPathForTransaction(
  req,
  options = {},
) {
  var method = req.method && req.method.toUpperCase();

  let path = '';
  let source = 'url';

  // Check to see if there's a parameterized route we can use (as there is in Express)
  if (options.customRoute || req.route) {
    path = options.customRoute || `${req.baseUrl || ''}${req.route && req.route.path}`;
    source = 'route';
  }

  // Otherwise, just take the original URL
  else if (req.originalUrl || req.url) {
    path = (0,_url_js__WEBPACK_IMPORTED_MODULE_0__.stripUrlQueryAndFragment)(req.originalUrl || req.url || '');
  }

  let name = '';
  if (options.method && method) {
    name += method;
  }
  if (options.method && options.path) {
    name += ' ';
  }
  if (options.path && path) {
    name += path;
  }

  return [name, source];
}

/** JSDoc */
function extractTransaction(req, type) {
  switch (type) {
    case 'path': {
      return extractPathForTransaction(req, { path: true })[0];
    }
    case 'handler': {
      return (req.route && req.route.stack && req.route.stack[0] && req.route.stack[0].name) || '<anonymous>';
    }
    case 'methodPath':
    default: {
      return extractPathForTransaction(req, { path: true, method: true })[0];
    }
  }
}

/** JSDoc */
function extractUserData(
  user

,
  keys,
) {
  var extractedUser = {};
  var attributes = Array.isArray(keys) ? keys : DEFAULT_USER_INCLUDES;

  attributes.forEach(key => {
    if (user && key in user) {
      extractedUser[key] = user[key];
    }
  });

  return extractedUser;
}

/**
 * Normalize data from the request object, accounting for framework differences.
 *
 * @param req The request object from which to extract data
 * @param options.include An optional array of keys to include in the normalized data. Defaults to
 * DEFAULT_REQUEST_INCLUDES if not provided.
 * @param options.deps Injected, platform-specific dependencies
 * @returns An object containing normalized request data
 */
function extractRequestData(
  req,
  options

,
) {
  const { include = DEFAULT_REQUEST_INCLUDES, deps } = options || {};
  var requestData = {};

  // headers:
  //   node, express, koa, nextjs: req.headers
  var headers = (req.headers || {}) 

;
  // method:
  //   node, express, koa, nextjs: req.method
  var method = req.method;
  // host:
  //   express: req.hostname in > 4 and req.host in < 4
  //   koa: req.host
  //   node, nextjs: req.headers.host
  var host = req.hostname || req.host || headers.host || '<no host>';
  // protocol:
  //   node, nextjs: <n/a>
  //   express, koa: req.protocol
  var protocol = req.protocol === 'https' || (req.socket && req.socket.encrypted) ? 'https' : 'http';
  // url (including path and query string):
  //   node, express: req.originalUrl
  //   koa, nextjs: req.url
  var originalUrl = req.originalUrl || req.url || '';
  // absolute url
  var absoluteUrl = `${protocol}://${host}${originalUrl}`;
  include.forEach(key => {
    switch (key) {
      case 'headers': {
        requestData.headers = headers;
        break;
      }
      case 'method': {
        requestData.method = method;
        break;
      }
      case 'url': {
        requestData.url = absoluteUrl;
        break;
      }
      case 'cookies': {
        // cookies:
        //   node, express, koa: req.headers.cookie
        //   vercel, sails.js, express (w/ cookie middleware), nextjs: req.cookies
                requestData.cookies =
          // TODO (v8 / #5257): We're only sending the empty object for backwards compatibility, so the last bit can
          // come off in v8
          req.cookies || (headers.cookie && deps && deps.cookie && deps.cookie.parse(headers.cookie)) || {};
        break;
      }
      case 'query_string': {
        // query string:
        //   node: req.url (raw)
        //   express, koa, nextjs: req.query
                requestData.query_string = extractQueryParams(req, deps);
        break;
      }
      case 'data': {
        if (method === 'GET' || method === 'HEAD') {
          break;
        }
        // body data:
        //   express, koa, nextjs: req.body
        //
        //   when using node by itself, you have to read the incoming stream(see
        //   https://nodejs.dev/learn/get-http-request-body-data-using-nodejs); if a user is doing that, we can't know
        //   where they're going to store the final result, so they'll have to capture this data themselves
        if (req.body !== undefined) {
          requestData.data = (0,_is_js__WEBPACK_IMPORTED_MODULE_1__.isString)(req.body) ? req.body : JSON.stringify((0,_normalize_js__WEBPACK_IMPORTED_MODULE_2__.normalize)(req.body));
        }
        break;
      }
      default: {
        if ({}.hasOwnProperty.call(req, key)) {
          requestData[key] = (req )[key];
        }
      }
    }
  });

  return requestData;
}

/**
 * Options deciding what parts of the request to use when enhancing an event
 */

/**
 * Add data from the given request to the given event
 *
 * @param event The event to which the request data will be added
 * @param req Request object
 * @param options.include Flags to control what data is included
 * @param options.deps Injected platform-specific dependencies
 * @hidden
 */
function addRequestDataToEvent(
  event,
  req,
  options,
) {
  var include = {
    ...DEFAULT_INCLUDES,
    ...(0,_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([options, 'optionalAccess', _ => _.include]),
  };

  if (include.request) {
    var extractedRequestData = Array.isArray(include.request)
      ? extractRequestData(req, { include: include.request, deps: (0,_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([options, 'optionalAccess', _2 => _2.deps]) })
      : extractRequestData(req, { deps: (0,_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([options, 'optionalAccess', _3 => _3.deps]) });

    event.request = {
      ...event.request,
      ...extractedRequestData,
    };
  }

  if (include.user) {
    var extractedUser = req.user && (0,_is_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(req.user) ? extractUserData(req.user, include.user) : {};

    if (Object.keys(extractedUser).length) {
      event.user = {
        ...event.user,
        ...extractedUser,
      };
    }
  }

  // client ip:
  //   node, nextjs: req.socket.remoteAddress
  //   express, koa: req.ip
  if (include.ip) {
    var ip = req.ip || (req.socket && req.socket.remoteAddress);
    if (ip) {
      event.user = {
        ...event.user,
        ip_address: ip,
      };
    }
  }

  if (include.transaction && !event.transaction) {
    // TODO do we even need this anymore?
    // TODO make this work for nextjs
    event.transaction = extractTransaction(req, include.transaction);
  }

  return event;
}

function extractQueryParams(
  req,
  deps,
) {
  // url (including path and query string):
  //   node, express: req.originalUrl
  //   koa, nextjs: req.url
  let originalUrl = req.originalUrl || req.url || '';

  if (!originalUrl) {
    return;
  }

  // The `URL` constructor can't handle internal URLs of the form `/some/path/here`, so stick a dummy protocol and
  // hostname on the beginning. Since the point here is just to grab the query string, it doesn't matter what we use.
  if (originalUrl.startsWith('/')) {
    originalUrl = `http://dogs.are.great${originalUrl}`;
  }

  return (
    req.query ||
    (typeof URL !== undefined && new URL(originalUrl).search.replace('?', '')) ||
    // In Node 8, `URL` isn't in the global scope, so we have to use the built-in module from Node
    (deps && deps.url && deps.url.parse(originalUrl).query) ||
    undefined
  );
}


//# sourceMappingURL=requestdata.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/severity.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "severityFromString": () => (/* binding */ severityFromString),
/* harmony export */   "severityLevelFromString": () => (/* binding */ severityLevelFromString),
/* harmony export */   "validSeverityLevels": () => (/* binding */ validSeverityLevels)
/* harmony export */ });
// Note: Ideally the `SeverityLevel` type would be derived from `validSeverityLevels`, but that would mean either
//
// a) moving `validSeverityLevels` to `@sentry/types`,
// b) moving the`SeverityLevel` type here, or
// c) importing `validSeverityLevels` from here into `@sentry/types`.
//
// Option A would make `@sentry/types` a runtime dependency of `@sentry/utils` (not good), and options B and C would
// create a circular dependency between `@sentry/types` and `@sentry/utils` (also not good). So a TODO accompanying the
// type, reminding anyone who changes it to change this list also, will have to do.

var validSeverityLevels = ['fatal', 'error', 'warning', 'log', 'info', 'debug'];

/**
 * Converts a string-based level into a member of the deprecated {@link Severity} enum.
 *
 * @deprecated `severityFromString` is deprecated. Please use `severityLevelFromString` instead.
 *
 * @param level String representation of Severity
 * @returns Severity
 */
function severityFromString(level) {
  return severityLevelFromString(level) ;
}

/**
 * Converts a string-based level into a `SeverityLevel`, normalizing it along the way.
 *
 * @param level String representation of desired `SeverityLevel`.
 * @returns The `SeverityLevel` corresponding to the given string, or 'log' if the string isn't a valid level.
 */
function severityLevelFromString(level) {
  return (level === 'warn' ? 'warning' : validSeverityLevels.includes(level) ? level : 'log') ;
}


//# sourceMappingURL=severity.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/stacktrace.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createStackParser": () => (/* binding */ createStackParser),
/* harmony export */   "getFunctionName": () => (/* binding */ getFunctionName),
/* harmony export */   "nodeStackLineParser": () => (/* binding */ nodeStackLineParser),
/* harmony export */   "stackParserFromStackParserOptions": () => (/* binding */ stackParserFromStackParserOptions),
/* harmony export */   "stripSentryFramesAndReverse": () => (/* binding */ stripSentryFramesAndReverse)
/* harmony export */ });
/* harmony import */ var _buildPolyfills__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js");


var STACKTRACE_LIMIT = 50;

/**
 * Creates a stack parser with the supplied line parsers
 *
 * StackFrames are returned in the correct order for Sentry Exception
 * frames and with Sentry SDK internal frames removed from the top and bottom
 *
 */
function createStackParser(...parsers) {
  var sortedParsers = parsers.sort((a, b) => a[0] - b[0]).map(p => p[1]);

  return (stack, skipFirst = 0) => {
    var frames = [];

    for (var line of stack.split('\n').slice(skipFirst)) {
      // https://github.com/getsentry/sentry-javascript/issues/5459
      // Remove webpack (error: *) wrappers
      var cleanedLine = line.replace(/\(error: (.*)\)/, '$1');

      for (var parser of sortedParsers) {
        var frame = parser(cleanedLine);

        if (frame) {
          frames.push(frame);
          break;
        }
      }
    }

    return stripSentryFramesAndReverse(frames);
  };
}

/**
 * Gets a stack parser implementation from Options.stackParser
 * @see Options
 *
 * If options contains an array of line parsers, it is converted into a parser
 */
function stackParserFromStackParserOptions(stackParser) {
  if (Array.isArray(stackParser)) {
    return createStackParser(...stackParser);
  }
  return stackParser;
}

/**
 * @hidden
 */
function stripSentryFramesAndReverse(stack) {
  if (!stack.length) {
    return [];
  }

  let localStack = stack;

  var firstFrameFunction = localStack[0].function || '';
  var lastFrameFunction = localStack[localStack.length - 1].function || '';

  // If stack starts with one of our API calls, remove it (starts, meaning it's the top of the stack - aka last call)
  if (firstFrameFunction.indexOf('captureMessage') !== -1 || firstFrameFunction.indexOf('captureException') !== -1) {
    localStack = localStack.slice(1);
  }

  // If stack ends with one of our internal API calls, remove it (ends, meaning it's the bottom of the stack - aka top-most call)
  if (lastFrameFunction.indexOf('sentryWrapped') !== -1) {
    localStack = localStack.slice(0, -1);
  }

  // The frame where the crash happened, should be the last entry in the array
  return localStack
    .slice(0, STACKTRACE_LIMIT)
    .map(frame => ({
      ...frame,
      filename: frame.filename || localStack[0].filename,
      function: frame.function || '?',
    }))
    .reverse();
}

var defaultFunctionName = '<anonymous>';

/**
 * Safely extract function name from itself
 */
function getFunctionName(fn) {
  try {
    if (!fn || typeof fn !== 'function') {
      return defaultFunctionName;
    }
    return fn.name || defaultFunctionName;
  } catch (e) {
    // Just accessing custom props in some Selenium environments
    // can cause a "Permission denied" exception (see raven-js#495).
    return defaultFunctionName;
  }
}

function node(getModule) {
  var FILENAME_MATCH = /^\s*[-]{4,}$/;
  var FULL_MATCH = /at (?:async )?(?:(.+?)\s+\()?(?:(.+):(\d+):(\d+)?|([^)]+))\)?/;

    return (line) => {
    if (line.match(FILENAME_MATCH)) {
      return {
        filename: line,
      };
    }

    var lineMatch = line.match(FULL_MATCH);
    if (!lineMatch) {
      return undefined;
    }

    let object;
    let method;
    let functionName;
    let typeName;
    let methodName;

    if (lineMatch[1]) {
      functionName = lineMatch[1];

      let methodStart = functionName.lastIndexOf('.');
      if (functionName[methodStart - 1] === '.') {
                methodStart--;
      }

      if (methodStart > 0) {
        object = functionName.substr(0, methodStart);
        method = functionName.substr(methodStart + 1);
        var objectEnd = object.indexOf('.Module');
        if (objectEnd > 0) {
          functionName = functionName.substr(objectEnd + 1);
          object = object.substr(0, objectEnd);
        }
      }
      typeName = undefined;
    }

    if (method) {
      typeName = object;
      methodName = method;
    }

    if (method === '<anonymous>') {
      methodName = undefined;
      functionName = undefined;
    }

    if (functionName === undefined) {
      methodName = methodName || '<anonymous>';
      functionName = typeName ? `${typeName}.${methodName}` : methodName;
    }

    var filename = (0,_buildPolyfills__WEBPACK_IMPORTED_MODULE_0__._optionalChain)([lineMatch, 'access', _ => _[2], 'optionalAccess', _2 => _2.startsWith, 'call', _3 => _3('file://')]) ? lineMatch[2].substr(7) : lineMatch[2];
    var isNative = lineMatch[5] === 'native';
    var isInternal =
      isNative || (filename && !filename.startsWith('/') && !filename.startsWith('.') && filename.indexOf(':\\') !== 1);

    // in_app is all that's not an internal Node function or a module within node_modules
    // note that isNative appears to return true even for node core libraries
    // see https://github.com/getsentry/raven-node/issues/176
    var in_app = !isInternal && filename !== undefined && !filename.includes('node_modules/');

    return {
      filename,
      module: (0,_buildPolyfills__WEBPACK_IMPORTED_MODULE_0__._optionalChain)([getModule, 'optionalCall', _4 => _4(filename)]),
      function: functionName,
      lineno: parseInt(lineMatch[3], 10) || undefined,
      colno: parseInt(lineMatch[4], 10) || undefined,
      in_app,
    };
  };
}

/**
 * Node.js stack line parser
 *
 * This is in @sentry/utils so it can be used from the Electron SDK in the browser for when `nodeIntegration == true`.
 * This allows it to be used without referencing or importing any node specific code which causes bundlers to complain
 */
function nodeStackLineParser(getModule) {
  return [90, node(getModule)];
}


//# sourceMappingURL=stacktrace.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/string.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "escapeStringForRegex": () => (/* binding */ escapeStringForRegex),
/* harmony export */   "isMatchingPattern": () => (/* binding */ isMatchingPattern),
/* harmony export */   "safeJoin": () => (/* binding */ safeJoin),
/* harmony export */   "snipLine": () => (/* binding */ snipLine),
/* harmony export */   "truncate": () => (/* binding */ truncate)
/* harmony export */ });
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/is.js");


/**
 * Truncates given string to the maximum characters count
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string (0 = unlimited)
 * @returns string Encoded
 */
function truncate(str, max = 0) {
  if (typeof str !== 'string' || max === 0) {
    return str;
  }
  return str.length <= max ? str : `${str.substr(0, max)}...`;
}

/**
 * This is basically just `trim_line` from
 * https://github.com/getsentry/sentry/blob/master/src/sentry/lang/javascript/processor.py#L67
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string
 * @returns string Encoded
 */
function snipLine(line, colno) {
  let newLine = line;
  var lineLength = newLine.length;
  if (lineLength <= 150) {
    return newLine;
  }
  if (colno > lineLength) {
        colno = lineLength;
  }

  let start = Math.max(colno - 60, 0);
  if (start < 5) {
    start = 0;
  }

  let end = Math.min(start + 140, lineLength);
  if (end > lineLength - 5) {
    end = lineLength;
  }
  if (end === lineLength) {
    start = Math.max(end - 140, 0);
  }

  newLine = newLine.slice(start, end);
  if (start > 0) {
    newLine = `'{snip} ${newLine}`;
  }
  if (end < lineLength) {
    newLine += ' {snip}';
  }

  return newLine;
}

/**
 * Join values in array
 * @param input array of values to be joined together
 * @param delimiter string to be placed in-between values
 * @returns Joined values
 */
function safeJoin(input, delimiter) {
  if (!Array.isArray(input)) {
    return '';
  }

  var output = [];
    for (let i = 0; i < input.length; i++) {
    var value = input[i];
    try {
      output.push(String(value));
    } catch (e) {
      output.push('[value cannot be serialized]');
    }
  }

  return output.join(delimiter);
}

/**
 * Checks if the value matches a regex or includes the string
 * @param value The string value to be checked against
 * @param pattern Either a regex or a string that must be contained in value
 */
function isMatchingPattern(value, pattern) {
  if (!(0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isString)(value)) {
    return false;
  }

  if ((0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isRegExp)(pattern)) {
    return pattern.test(value);
  }
  if (typeof pattern === 'string') {
    return value.indexOf(pattern) !== -1;
  }
  return false;
}

/**
 * Given a string, escape characters which have meaning in the regex grammar, such that the result is safe to feed to
 * `new RegExp()`.
 *
 * Based on https://github.com/sindresorhus/escape-string-regexp. Vendored to a) reduce the size by skipping the runtime
 * type-checking, and b) ensure it gets down-compiled for old versions of Node (the published package only supports Node
 * 12+).
 *
 * @param regexString The string to escape
 * @returns An version of the string with all special regex characters escaped
 */
function escapeStringForRegex(regexString) {
  // escape the hyphen separately so we can also replace it with a unicode literal hyphen, to avoid the problems
  // discussed in https://github.com/sindresorhus/escape-string-regexp/issues/20.
  return regexString.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}


//# sourceMappingURL=string.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/syncpromise.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SyncPromise": () => (/* binding */ SyncPromise),
/* harmony export */   "rejectedSyncPromise": () => (/* binding */ rejectedSyncPromise),
/* harmony export */   "resolvedSyncPromise": () => (/* binding */ resolvedSyncPromise)
/* harmony export */ });
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/is.js");


/** SyncPromise internal states */
var States; (function (States) {
  /** Pending */
  var PENDING = 0; States[States["PENDING"] = PENDING] = "PENDING";
  /** Resolved / OK */
  var RESOLVED = 1; States[States["RESOLVED"] = RESOLVED] = "RESOLVED";
  /** Rejected / Error */
  var REJECTED = 2; States[States["REJECTED"] = REJECTED] = "REJECTED";
})(States || (States = {}));

// Overloads so we can call resolvedSyncPromise without arguments and generic argument

/**
 * Creates a resolved sync promise.
 *
 * @param value the value to resolve the promise with
 * @returns the resolved sync promise
 */
function resolvedSyncPromise(value) {
  return new SyncPromise(resolve => {
    resolve(value);
  });
}

/**
 * Creates a rejected sync promise.
 *
 * @param value the value to reject the promise with
 * @returns the rejected sync promise
 */
function rejectedSyncPromise(reason) {
  return new SyncPromise((_, reject) => {
    reject(reason);
  });
}

/**
 * Thenable class that behaves like a Promise and follows it's interface
 * but is not async internally
 */
class SyncPromise {
   __init() {this._state = States.PENDING;}
   __init2() {this._handlers = [];}
  

   constructor(
    executor,
  ) {;SyncPromise.prototype.__init.call(this);SyncPromise.prototype.__init2.call(this);SyncPromise.prototype.__init3.call(this);SyncPromise.prototype.__init4.call(this);SyncPromise.prototype.__init5.call(this);SyncPromise.prototype.__init6.call(this);
    try {
      executor(this._resolve, this._reject);
    } catch (e) {
      this._reject(e);
    }
  }

  /** JSDoc */
   then(
    onfulfilled,
    onrejected,
  ) {
    return new SyncPromise((resolve, reject) => {
      this._handlers.push([
        false,
        result => {
          if (!onfulfilled) {
            // TODO: ¯\_(ツ)_/¯
            // TODO: FIXME
            resolve(result );
          } else {
            try {
              resolve(onfulfilled(result));
            } catch (e) {
              reject(e);
            }
          }
        },
        reason => {
          if (!onrejected) {
            reject(reason);
          } else {
            try {
              resolve(onrejected(reason));
            } catch (e) {
              reject(e);
            }
          }
        },
      ]);
      this._executeHandlers();
    });
  }

  /** JSDoc */
   catch(
    onrejected,
  ) {
    return this.then(val => val, onrejected);
  }

  /** JSDoc */
   finally(onfinally) {
    return new SyncPromise((resolve, reject) => {
      let val;
      let isRejected;

      return this.then(
        value => {
          isRejected = false;
          val = value;
          if (onfinally) {
            onfinally();
          }
        },
        reason => {
          isRejected = true;
          val = reason;
          if (onfinally) {
            onfinally();
          }
        },
      ).then(() => {
        if (isRejected) {
          reject(val);
          return;
        }

        resolve(val );
      });
    });
  }

  /** JSDoc */
    __init3() {this._resolve = (value) => {
    this._setResult(States.RESOLVED, value);
  };}

  /** JSDoc */
    __init4() {this._reject = (reason) => {
    this._setResult(States.REJECTED, reason);
  };}

  /** JSDoc */
    __init5() {this._setResult = (state, value) => {
    if (this._state !== States.PENDING) {
      return;
    }

    if ((0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isThenable)(value)) {
      void (value ).then(this._resolve, this._reject);
      return;
    }

    this._state = state;
    this._value = value;

    this._executeHandlers();
  };}

  /** JSDoc */
    __init6() {this._executeHandlers = () => {
    if (this._state === States.PENDING) {
      return;
    }

    var cachedHandlers = this._handlers.slice();
    this._handlers = [];

    cachedHandlers.forEach(handler => {
      if (handler[0]) {
        return;
      }

      if (this._state === States.RESOLVED) {
                handler[1](this._value );
      }

      if (this._state === States.REJECTED) {
        handler[2](this._value);
      }

      handler[0] = true;
    });
  };}
}


//# sourceMappingURL=syncpromise.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/time.js":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_browserPerformanceTimeOriginMode": () => (/* binding */ _browserPerformanceTimeOriginMode),
/* harmony export */   "browserPerformanceTimeOrigin": () => (/* binding */ browserPerformanceTimeOrigin),
/* harmony export */   "dateTimestampInSeconds": () => (/* binding */ dateTimestampInSeconds),
/* harmony export */   "timestampInSeconds": () => (/* binding */ timestampInSeconds),
/* harmony export */   "timestampWithMs": () => (/* binding */ timestampWithMs),
/* harmony export */   "usingPerformanceAPI": () => (/* binding */ usingPerformanceAPI)
/* harmony export */ });
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/@sentry/utils/esm/global.js");
/* harmony import */ var _node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/@sentry/utils/esm/node.js");
/* module decorator */ module = __webpack_require__.hmd(module);



/**
 * An object that can return the current timestamp in seconds since the UNIX epoch.
 */

/**
 * A TimestampSource implementation for environments that do not support the Performance Web API natively.
 *
 * Note that this TimestampSource does not use a monotonic clock. A call to `nowSeconds` may return a timestamp earlier
 * than a previously returned value. We do not try to emulate a monotonic behavior in order to facilitate debugging. It
 * is more obvious to explain "why does my span have negative duration" than "why my spans have zero duration".
 */
var dateTimestampSource = {
  nowSeconds: () => Date.now() / 1000,
};

/**
 * A partial definition of the [Performance Web API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Performance}
 * for accessing a high-resolution monotonic clock.
 */

/**
 * Returns a wrapper around the native Performance API browser implementation, or undefined for browsers that do not
 * support the API.
 *
 * Wrapping the native API works around differences in behavior from different browsers.
 */
function getBrowserPerformance() {
  const { performance } = (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();
  if (!performance || !performance.now) {
    return undefined;
  }

  // Replace performance.timeOrigin with our own timeOrigin based on Date.now().
  //
  // This is a partial workaround for browsers reporting performance.timeOrigin such that performance.timeOrigin +
  // performance.now() gives a date arbitrarily in the past.
  //
  // Additionally, computing timeOrigin in this way fills the gap for browsers where performance.timeOrigin is
  // undefined.
  //
  // The assumption that performance.timeOrigin + performance.now() ~= Date.now() is flawed, but we depend on it to
  // interact with data coming out of performance entries.
  //
  // Note that despite recommendations against it in the spec, browsers implement the Performance API with a clock that
  // might stop when the computer is asleep (and perhaps under other circumstances). Such behavior causes
  // performance.timeOrigin + performance.now() to have an arbitrary skew over Date.now(). In laptop computers, we have
  // observed skews that can be as long as days, weeks or months.
  //
  // See https://github.com/getsentry/sentry-javascript/issues/2590.
  //
  // BUG: despite our best intentions, this workaround has its limitations. It mostly addresses timings of pageload
  // transactions, but ignores the skew built up over time that can aversely affect timestamps of navigation
  // transactions of long-lived web pages.
  var timeOrigin = Date.now() - performance.now();

  return {
    now: () => performance.now(),
    timeOrigin,
  };
}

/**
 * Returns the native Performance API implementation from Node.js. Returns undefined in old Node.js versions that don't
 * implement the API.
 */
function getNodePerformance() {
  try {
    var perfHooks = (0,_node_js__WEBPACK_IMPORTED_MODULE_1__.dynamicRequire)(module, 'perf_hooks') ;
    return perfHooks.performance;
  } catch (_) {
    return undefined;
  }
}

/**
 * The Performance API implementation for the current platform, if available.
 */
var platformPerformance = (0,_node_js__WEBPACK_IMPORTED_MODULE_1__.isNodeEnv)() ? getNodePerformance() : getBrowserPerformance();

var timestampSource =
  platformPerformance === undefined
    ? dateTimestampSource
    : {
        nowSeconds: () => (platformPerformance.timeOrigin + platformPerformance.now()) / 1000,
      };

/**
 * Returns a timestamp in seconds since the UNIX epoch using the Date API.
 */
var dateTimestampInSeconds = dateTimestampSource.nowSeconds.bind(dateTimestampSource);

/**
 * Returns a timestamp in seconds since the UNIX epoch using either the Performance or Date APIs, depending on the
 * availability of the Performance API.
 *
 * See `usingPerformanceAPI` to test whether the Performance API is used.
 *
 * BUG: Note that because of how browsers implement the Performance API, the clock might stop when the computer is
 * asleep. This creates a skew between `dateTimestampInSeconds` and `timestampInSeconds`. The
 * skew can grow to arbitrary amounts like days, weeks or months.
 * See https://github.com/getsentry/sentry-javascript/issues/2590.
 */
var timestampInSeconds = timestampSource.nowSeconds.bind(timestampSource);

// Re-exported with an old name for backwards-compatibility.
var timestampWithMs = timestampInSeconds;

/**
 * A boolean that is true when timestampInSeconds uses the Performance API to produce monotonic timestamps.
 */
var usingPerformanceAPI = platformPerformance !== undefined;

/**
 * Internal helper to store what is the source of browserPerformanceTimeOrigin below. For debugging only.
 */
let _browserPerformanceTimeOriginMode;

/**
 * The number of milliseconds since the UNIX epoch. This value is only usable in a browser, and only when the
 * performance API is available.
 */
var browserPerformanceTimeOrigin = (() => {
  // Unfortunately browsers may report an inaccurate time origin data, through either performance.timeOrigin or
  // performance.timing.navigationStart, which results in poor results in performance data. We only treat time origin
  // data as reliable if they are within a reasonable threshold of the current time.

  const { performance } = (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();
  if (!performance || !performance.now) {
    _browserPerformanceTimeOriginMode = 'none';
    return undefined;
  }

  var threshold = 3600 * 1000;
  var performanceNow = performance.now();
  var dateNow = Date.now();

  // if timeOrigin isn't available set delta to threshold so it isn't used
  var timeOriginDelta = performance.timeOrigin
    ? Math.abs(performance.timeOrigin + performanceNow - dateNow)
    : threshold;
  var timeOriginIsReliable = timeOriginDelta < threshold;

  // While performance.timing.navigationStart is deprecated in favor of performance.timeOrigin, performance.timeOrigin
  // is not as widely supported. Namely, performance.timeOrigin is undefined in Safari as of writing.
  // Also as of writing, performance.timing is not available in Web Workers in mainstream browsers, so it is not always
  // a valid fallback. In the absence of an initial time provided by the browser, fallback to the current time from the
  // Date API.
    var navigationStart = performance.timing && performance.timing.navigationStart;
  var hasNavigationStart = typeof navigationStart === 'number';
  // if navigationStart isn't available set delta to threshold so it isn't used
  var navigationStartDelta = hasNavigationStart ? Math.abs(navigationStart + performanceNow - dateNow) : threshold;
  var navigationStartIsReliable = navigationStartDelta < threshold;

  if (timeOriginIsReliable || navigationStartIsReliable) {
    // Use the more reliable time origin
    if (timeOriginDelta <= navigationStartDelta) {
      _browserPerformanceTimeOriginMode = 'timeOrigin';
      return performance.timeOrigin;
    } else {
      _browserPerformanceTimeOriginMode = 'navigationStart';
      return navigationStart;
    }
  }

  // Either both timeOrigin and navigationStart are skewed or neither is available, fallback to Date.
  _browserPerformanceTimeOriginMode = 'dateNow';
  return dateNow;
})();


//# sourceMappingURL=time.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/tracing.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TRACEPARENT_REGEXP": () => (/* binding */ TRACEPARENT_REGEXP),
/* harmony export */   "extractTraceparentData": () => (/* binding */ extractTraceparentData)
/* harmony export */ });
var TRACEPARENT_REGEXP = new RegExp(
  '^[ \\t]*' + // whitespace
    '([0-9a-f]{32})?' + // trace_id
    '-?([0-9a-f]{16})?' + // span_id
    '-?([01])?' + // sampled
    '[ \\t]*$', // whitespace
);

/**
 * Extract transaction context data from a `sentry-trace` header.
 *
 * @param traceparent Traceparent string
 *
 * @returns Object containing data from the header, or undefined if traceparent string is malformed
 */
function extractTraceparentData(traceparent) {
  var matches = traceparent.match(TRACEPARENT_REGEXP);
  if (matches) {
    let parentSampled;
    if (matches[3] === '1') {
      parentSampled = true;
    } else if (matches[3] === '0') {
      parentSampled = false;
    }
    return {
      traceId: matches[1],
      parentSampled,
      parentSpanId: matches[2],
    };
  }
  return undefined;
}


//# sourceMappingURL=tracing.js.map


/***/ }),

/***/ "./node_modules/@sentry/utils/esm/url.js":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getNumberOfUrlSegments": () => (/* binding */ getNumberOfUrlSegments),
/* harmony export */   "parseUrl": () => (/* binding */ parseUrl),
/* harmony export */   "stripUrlQueryAndFragment": () => (/* binding */ stripUrlQueryAndFragment)
/* harmony export */ });
/**
 * Parses string form of URL into an object
 * // borrowed from https://tools.ietf.org/html/rfc3986#appendix-B
 * // intentionally using regex and not <a/> href parsing trick because React Native and other
 * // environments where DOM might not be available
 * @returns parsed URL object
 */
function parseUrl(url)

 {
  if (!url) {
    return {};
  }

  var match = url.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);

  if (!match) {
    return {};
  }

  // coerce to undefined values to empty string so we don't get 'undefined'
  var query = match[6] || '';
  var fragment = match[8] || '';
  return {
    host: match[4],
    path: match[5],
    protocol: match[2],
    relative: match[5] + query + fragment, // everything minus origin
  };
}

/**
 * Strip the query string and fragment off of a given URL or path (if present)
 *
 * @param urlPath Full URL or path, including possible query string and/or fragment
 * @returns URL or path without query string or fragment
 */
function stripUrlQueryAndFragment(urlPath) {
    return urlPath.split(/[\?#]/, 1)[0];
}

/**
 * Returns number of URL segments of a passed string URL.
 */
function getNumberOfUrlSegments(url) {
  // split at '/' or at '\/' to split regex urls correctly
  return url.split(/\\?\//).filter(s => s.length > 0 && s !== ',').length;
}


//# sourceMappingURL=url.js.map


/***/ }),

/***/ "./node_modules/lru_map/lru.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * A doubly linked list-based Least Recently Used (LRU) cache. Will keep most
 * recently used items while discarding least recently used items when its limit
 * is reached.
 *
 * Licensed under MIT. Copyright (c) 2010 Rasmus Andersson <http://hunch.se/>
 * See README.md for details.
 *
 * Illustration of the design:
 *
 *       entry             entry             entry             entry
 *       ______            ______            ______            ______
 *      | head |.newer => |      |.newer => |      |.newer => | tail |
 *      |  A   |          |  B   |          |  C   |          |  D   |
 *      |______| <= older.|______| <= older.|______| <= older.|______|
 *
 *  removed  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  added
 */
(function(g,f){
  const e =  true ? exports : 0;
  f(e);
  if (true) { !(__WEBPACK_AMD_DEFINE_FACTORY__ = (e),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); }
})(this, function(exports) {

const NEWER = Symbol('newer');
const OLDER = Symbol('older');

function LRUMap(limit, entries) {
  if (typeof limit !== 'number') {
    // called as (entries)
    entries = limit;
    limit = 0;
  }

  this.size = 0;
  this.limit = limit;
  this.oldest = this.newest = undefined;
  this._keymap = new Map();

  if (entries) {
    this.assign(entries);
    if (limit < 1) {
      this.limit = this.size;
    }
  }
}

exports.LRUMap = LRUMap;

function Entry(key, value) {
  this.key = key;
  this.value = value;
  this[NEWER] = undefined;
  this[OLDER] = undefined;
}


LRUMap.prototype._markEntryAsUsed = function(entry) {
  if (entry === this.newest) {
    // Already the most recenlty used entry, so no need to update the list
    return;
  }
  // HEAD--------------TAIL
  //   <.older   .newer>
  //  <--- add direction --
  //   A  B  C  <D>  E
  if (entry[NEWER]) {
    if (entry === this.oldest) {
      this.oldest = entry[NEWER];
    }
    entry[NEWER][OLDER] = entry[OLDER]; // C <-- E.
  }
  if (entry[OLDER]) {
    entry[OLDER][NEWER] = entry[NEWER]; // C. --> E
  }
  entry[NEWER] = undefined; // D --x
  entry[OLDER] = this.newest; // D. --> E
  if (this.newest) {
    this.newest[NEWER] = entry; // E. <-- D
  }
  this.newest = entry;
};

LRUMap.prototype.assign = function(entries) {
  let entry, limit = this.limit || Number.MAX_VALUE;
  this._keymap.clear();
  let it = entries[Symbol.iterator]();
  for (let itv = it.next(); !itv.done; itv = it.next()) {
    let e = new Entry(itv.value[0], itv.value[1]);
    this._keymap.set(e.key, e);
    if (!entry) {
      this.oldest = e;
    } else {
      entry[NEWER] = e;
      e[OLDER] = entry;
    }
    entry = e;
    if (limit-- == 0) {
      throw new Error('overflow');
    }
  }
  this.newest = entry;
  this.size = this._keymap.size;
};

LRUMap.prototype.get = function(key) {
  // First, find our cache entry
  var entry = this._keymap.get(key);
  if (!entry) return; // Not cached. Sorry.
  // As <key> was found in the cache, register it as being requested recently
  this._markEntryAsUsed(entry);
  return entry.value;
};

LRUMap.prototype.set = function(key, value) {
  var entry = this._keymap.get(key);

  if (entry) {
    // update existing
    entry.value = value;
    this._markEntryAsUsed(entry);
    return this;
  }

  // new entry
  this._keymap.set(key, (entry = new Entry(key, value)));

  if (this.newest) {
    // link previous tail to the new tail (entry)
    this.newest[NEWER] = entry;
    entry[OLDER] = this.newest;
  } else {
    // we're first in -- yay
    this.oldest = entry;
  }

  // add new entry to the end of the linked list -- it's now the freshest entry.
  this.newest = entry;
  ++this.size;
  if (this.size > this.limit) {
    // we hit the limit -- remove the head
    this.shift();
  }

  return this;
};

LRUMap.prototype.shift = function() {
  // todo: handle special case when limit == 1
  var entry = this.oldest;
  if (entry) {
    if (this.oldest[NEWER]) {
      // advance the list
      this.oldest = this.oldest[NEWER];
      this.oldest[OLDER] = undefined;
    } else {
      // the cache is exhausted
      this.oldest = undefined;
      this.newest = undefined;
    }
    // Remove last strong reference to <entry> and remove links from the purged
    // entry being returned:
    entry[NEWER] = entry[OLDER] = undefined;
    this._keymap.delete(entry.key);
    --this.size;
    return [entry.key, entry.value];
  }
};

// ----------------------------------------------------------------------------
// Following code is optional and can be removed without breaking the core
// functionality.

LRUMap.prototype.find = function(key) {
  let e = this._keymap.get(key);
  return e ? e.value : undefined;
};

LRUMap.prototype.has = function(key) {
  return this._keymap.has(key);
};

LRUMap.prototype['delete'] = function(key) {
  var entry = this._keymap.get(key);
  if (!entry) return;
  this._keymap.delete(entry.key);
  if (entry[NEWER] && entry[OLDER]) {
    // relink the older entry with the newer entry
    entry[OLDER][NEWER] = entry[NEWER];
    entry[NEWER][OLDER] = entry[OLDER];
  } else if (entry[NEWER]) {
    // remove the link to us
    entry[NEWER][OLDER] = undefined;
    // link the newer entry to head
    this.oldest = entry[NEWER];
  } else if (entry[OLDER]) {
    // remove the link to us
    entry[OLDER][NEWER] = undefined;
    // link the newer entry to head
    this.newest = entry[OLDER];
  } else {// if(entry[OLDER] === undefined && entry.newer === undefined) {
    this.oldest = this.newest = undefined;
  }

  this.size--;
  return entry.value;
};

LRUMap.prototype.clear = function() {
  // Not clearing links should be safe, as we don't expose live links to user
  this.oldest = this.newest = undefined;
  this.size = 0;
  this._keymap.clear();
};


function EntryIterator(oldestEntry) { this.entry = oldestEntry; }
EntryIterator.prototype[Symbol.iterator] = function() { return this; }
EntryIterator.prototype.next = function() {
  let ent = this.entry;
  if (ent) {
    this.entry = ent[NEWER];
    return { done: false, value: [ent.key, ent.value] };
  } else {
    return { done: true, value: undefined };
  }
};


function KeyIterator(oldestEntry) { this.entry = oldestEntry; }
KeyIterator.prototype[Symbol.iterator] = function() { return this; }
KeyIterator.prototype.next = function() {
  let ent = this.entry;
  if (ent) {
    this.entry = ent[NEWER];
    return { done: false, value: ent.key };
  } else {
    return { done: true, value: undefined };
  }
};

function ValueIterator(oldestEntry) { this.entry = oldestEntry; }
ValueIterator.prototype[Symbol.iterator] = function() { return this; }
ValueIterator.prototype.next = function() {
  let ent = this.entry;
  if (ent) {
    this.entry = ent[NEWER];
    return { done: false, value: ent.value };
  } else {
    return { done: true, value: undefined };
  }
};


LRUMap.prototype.keys = function() {
  return new KeyIterator(this.oldest);
};

LRUMap.prototype.values = function() {
  return new ValueIterator(this.oldest);
};

LRUMap.prototype.entries = function() {
  return this;
};

LRUMap.prototype[Symbol.iterator] = function() {
  return new EntryIterator(this.oldest);
};

LRUMap.prototype.forEach = function(fun, thisObj) {
  if (typeof thisObj !== 'object') {
    thisObj = this;
  }
  let entry = this.oldest;
  while (entry) {
    fun.call(thisObj, entry.value, entry.key, this);
    entry = entry[NEWER];
  }
};

/** Returns a JSON (array) representation */
LRUMap.prototype.toJSON = function() {
  var s = new Array(this.size), i = 0, entry = this.oldest;
  while (entry) {
    s[i++] = { key: entry.key, value: entry.value };
    entry = entry[NEWER];
  }
  return s;
};

/** Returns a String representation */
LRUMap.prototype.toString = function() {
  var s = '', entry = this.oldest;
  while (entry) {
    s += String(entry.key)+':'+entry.value;
    entry = entry[NEWER];
    if (entry) {
      s += ' < ';
    }
  }
  return s;
};

});


/***/ }),

/***/ "./apps/pm-backend/src/config/database.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const tslib_1 = __webpack_require__("tslib");
const mongoose = __webpack_require__("mongoose");
const dbConnection = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    console.log('Connecting to mongoDB...');
    const connection = yield mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log(`MongoDB connection successful !`);
});
module.exports = dbConnection;


/***/ }),

/***/ "./apps/pm-backend/src/controllers/admin.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const tslib_1 = __webpack_require__("tslib");
const asyncHandler = __webpack_require__("./apps/pm-backend/src/middleware/async.js");
const User = __webpack_require__("./apps/pm-backend/src/models/Users.js");
const CustomErrorResponse = __webpack_require__("./apps/pm-backend/src/utilities/errorResponse.js");
const okta = __webpack_require__("@okta/okta-sdk-nodejs");
//getting all users profiles
exports.getAllUsersProfiles = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield User.find();
        res.status(200).json({ user: allUsers });
    }
    catch (error) {
        return next(new CustomErrorResponse('Error! Please try later', 500));
    }
}));


/***/ }),

/***/ "./apps/pm-backend/src/controllers/conversations.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const tslib_1 = __webpack_require__("tslib");
const asyncHandler = __webpack_require__("./apps/pm-backend/src/middleware/async.js");
const User = __webpack_require__("./apps/pm-backend/src/models/Users.js");
const CustomErrorResponse = __webpack_require__("./apps/pm-backend/src/utilities/errorResponse.js");
const mongoose = __webpack_require__("mongoose");
// @desc   Send a New Message
// @route  POST /api/v1/conversations?receiver="receiverID"&sender="senderID"
// @access Private
// In One go...the message sent MUST be in "conversations" array of both user1 and user2.
// Otherwise, consider that attempt to send message as failure. So a MongoDB/Mongoose Transaction must be used.
exports.sendMessage = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const oktaUserId1 = req.query.sender;
    const oktaUserId2 = req.query.receiver;
    // I want the message object to have SAME _id in both users
    // This will help me to enable read receipts
    const message = {
        message: req.body.message,
        messageSenderId: oktaUserId1,
        messageReceiverId: oktaUserId2,
        isRead: false,
    };
    console.log(message);
    const session = yield User.startSession();
    try {
        session.startTransaction();
        let user1 = yield User.find({ oktaUserId: oktaUserId1 });
        user1 = user1[0];
        let user2 = yield User.find({ oktaUserId: oktaUserId2 });
        user2 = user2[0];
        /**=============================================================== */
        // User1 wants to send Message to User2
        // NOTE: Messages are stored in an interest object's conversations property(array).
        // STEP 1
        // Determine if it is User1 who first sent the interest.
        const didUser1SendInterestToUser2 = user1.interestsSent.some((interest) => String(interest.interestReceiverId) === oktaUserId2);
        // Determine if it is User1 who first received the interest.
        const didUser1ReceiveInterestFromUser2 = user1.interestsReceived.some((interest) => String(interest.interestSenderId === oktaUserId2));
        // If User1 is the first sender, then interest object will be in interestsSent Array
        // If User1 is the first receiver, then interest object will be in interestsReceived Array
        // Based on the location of interest object, update its conversations array...
        if (didUser1SendInterestToUser2) {
            // if user1 is the interest sender. So update interest object in interestsSent array of user 1
            user1.interestsSent = user1.interestsSent.map((interest) => {
                if (String(interest.interestReceiverId) === oktaUserId2) {
                    interest.conversations.push(message);
                }
                return interest;
            });
            // if user1 is the interest sender, then user2 is interest receiver.
            // so interest object will be in user2's interestsReceived array
            user2.interestsReceived = user2.interestsReceived.map((interest) => {
                if (String(interest.interestSenderId) === oktaUserId1) {
                    interest.conversations.push(message);
                }
                return interest;
            });
        }
        else if (didUser1ReceiveInterestFromUser2) {
            // user1 is interest receiver. Hence, update interest object in interestsReceived array of user1
            user1.interestsReceived = user1.interestsReceived.map((interest) => {
                if (String(interest.interestSenderId) === oktaUserId2) {
                    interest.conversations.push(message);
                }
                return interest;
            });
            // if user1 is the interest receiver.
            // then user2 is the interest sender. So update interest object in interestsSent array of user2
            user2.interestsSent = user2.interestsSent.map((interest) => {
                if (String(interest.interestReceiverId) === oktaUserId1) {
                    interest.conversations.push(message);
                }
                return interest;
            });
        }
        else {
            // If interest object is not present in both, then message cant be sent.
            throw `Permission denied.`;
        }
        /**=============================================================== */
        yield user1.save();
        yield user2.save();
        yield session.commitTransaction();
        session.endSession();
        res.status(200).json({
            success: true,
            message: 'Message sent !',
        });
    }
    catch (error) {
        // If an error occurred, abort the whole transaction and
        // undo any changes that might have happened
        // console.log(error);
        yield session.abortTransaction();
        session.endSession();
        return next(new CustomErrorResponse('Message not sent! Please try later', 500));
    }
}));
// @desc   Mark all messages between two users as "Read"
// @route  PUT /api/v1/conversations?user1="oktaUserId1"&user2="oktaUserId2"
// @access Private
exports.markMessagesAsRead = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const oktaUserId1 = req.query.user1;
    const oktaUserId2 = req.query.user2;
    const session = yield User.startSession();
    try {
        session.startTransaction();
        let user1 = yield User.find({ oktaUserId: oktaUserId1 });
        user1 = user1[0];
        let user2 = yield User.find({ oktaUserId: oktaUserId2 });
        user2 = user2[0];
        // STEP 1
        // Determine if it is User1 who first sent the interest.
        const didUser1SendInterestToUser2 = user1.interestsSent.some((interest) => String(interest.interestReceiverId) === oktaUserId2);
        // Determine if it is User1 who first received the interest.
        const didUser1ReceiveInterestFromUser2 = user1.interestsReceived.some((interest) => String(interest.interestSenderId === oktaUserId2));
        if (didUser1SendInterestToUser2) {
            // if User1 sent interest to User2, then...
            // 1. Identify the interest object specific to user2 in interestsSent array of user1
            // 2. Then update the conversations array of that object, mark all messages as read.
            // 3. Also, find the interest object specific to user 1 in interestsReceived array of user2
            // 4. Update conversations array of that object by marking all messages as read.
            user1.interestsSent = user1.interestsSent.map((interest) => {
                if (String(interest.interestReceiverId) === user2.oktaUserId) {
                    // marking all unread messages as read.
                    interest.conversations = interest.conversations.map((message) => {
                        if (!message.isRead) {
                            message.isRead = true;
                        }
                        return message;
                    });
                }
                return interest;
            });
            user2.interestsReceived = user2.interestsReceived.map((interest) => {
                if (String(interest.interestSenderId) === user1.oktaUserId) {
                    // marking all messages as read.
                    interest.conversations = interest.conversations.map((message) => {
                        if (!message.isRead) {
                            message.isRead = true;
                        }
                        return message;
                    });
                }
                return interest;
            });
        }
        else if (didUser1ReceiveInterestFromUser2) {
            // if User1 sent received interest from User2, then...
            // 1. Identify the interest object specific to user2 in interestsReceived array of user1
            // 2. Then update the conversations array of that object, mark all messages as read.
            // 3. Also, find the interest object specific to user 1 in interestsSent array of user2
            // 4. Update conversations array of that object by marking all messages as read.
            user1.interestsReceived = user1.interestsReceived.map((interest) => {
                if (String(interest.interestSenderId) === user2.oktaUserId) {
                    // marking all messages as read.
                    interest.conversations = interest.conversations.map((message) => {
                        if (!message.isRead) {
                            message.isRead = true;
                        }
                        return message;
                    });
                }
                return interest;
            });
            user2.interestsSent = user2.interestsSent.map((interest) => {
                if (String(interest.interestReceiverId) === user1.oktaUserId) {
                    interest.conversations = interest.conversations.map((message) => {
                        // marking all messages as read.
                        if (!message.isRead) {
                            message.isRead = true;
                        }
                        return message;
                    });
                }
                return interest;
            });
        }
        else {
            throw 'Permission denied.';
        }
        yield user1.save();
        yield user2.save();
    }
    catch (error) {
        // If an error occurred, abort the whole transaction and
        // undo any changes that might have happened
        // console.log(error);
        yield session.abortTransaction();
        session.endSession();
        return next(new CustomErrorResponse('Error! Please try later', 500));
    }
    res.status(200).json({
        success: true,
        message: 'Messages marked as read !',
    });
}));
// @desc   Get all messages between two users as "Read"
// @route  GET /api/v1/conversations/:oktaUserId
// @access Private
exports.getMessages = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield User.find({ oktaUserId: req.params.oktaUserId });
        user = user[0];
        console.log(user);
        if (!user) {
            return next(new CustomErrorResponse(`User not found!`, 404));
        }
        res.status(200).json({
            success: true,
            message: 'Data Retrieved Successfull !',
            interestsReceived: [...user.interestsReceived],
            interestsSent: [...user.interestsSent],
        });
    }
    catch (error) {
        return next(new CustomErrorResponse(`Error! Please try later`, 500));
    }
}));


/***/ }),

/***/ "./apps/pm-backend/src/controllers/interests.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const tslib_1 = __webpack_require__("tslib");
const asyncHandler = __webpack_require__("./apps/pm-backend/src/middleware/async.js");
const User = __webpack_require__("./apps/pm-backend/src/models/Users.js");
const CustomErrorResponse = __webpack_require__("./apps/pm-backend/src/utilities/errorResponse.js");
const mongoose = __webpack_require__("mongoose");
// @desc   Send a New Interest
// @route  POST /api/v1/interests?sender=oktaUserId1&receiver=oktaUserId2
// @access Private
// In One go...the interest sent MUST be in "interestsSent" array of Sender and "interestsReceived" array of Receiver.
// Otherwise, consider that attempt to send interest as failure. So a MongoDB/Mongoose Transaction must be used.
exports.sendInterest = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const oktaUserId1 = req.query.sender;
    const oktaUserId2 = req.query.receiver;
    const session = yield User.startSession();
    console.log('oktaUserId1 ', oktaUserId1);
    console.log('oktaUserId2 ', oktaUserId2);
    try {
        session.startTransaction();
        let user1 = yield User.find({ oktaUserId: oktaUserId1 });
        user1 = user1[0];
        let user2 = yield User.find({ oktaUserId: oktaUserId2 });
        user2 = user2[0];
        /**=============================================================== */
        // User1 wants to send Interest to User2
        // NOTE: Interests are stored as objects in interestsSender array of Sender(User1)
        // & also in interestsReceived array of Receiver(User2).
        // Step 1: Determine if User1 already send or received interest to/from User 2 ?
        // If Yes, then throw error that You've already sent/received interest to User 2
        // Checking interestsSent and interestsReceived array of User1
        const didUser1AlreadySendInterestToUser2 = user1.interestsSent.some((interest) => interest.interestReceiverId === oktaUserId2);
        console.log('didUser1AlreadySendInterestToUser2', didUser1AlreadySendInterestToUser2);
        if (didUser1AlreadySendInterestToUser2) {
            yield session.abortTransaction();
            session.endSession();
            return next(new CustomErrorResponse(`Interest already sent to ${user2.name}. Please wait for response.`, 400));
        }
        const didUser1AlreadyReceiveInterestFromUser2 = user1.interestsReceived.some((interest) => interest.interestSenderId === oktaUserId2);
        console.log('didUser1AlreadyReceiveInterestFromUser2', didUser1AlreadyReceiveInterestFromUser2);
        if (didUser1AlreadyReceiveInterestFromUser2) {
            yield session.abortTransaction();
            session.endSession();
            return next(new CustomErrorResponse(`Interest already received from ${user2.name}. Please respond to it.`, 400));
        }
        const maleImagePlaceholder = `https://res.cloudinary.com/pesto-matrimony/image/upload/v1662374871/e0kfqgvenrb2mhpzya4a.png`;
        const femaleImagePlaceholder = `https://res.cloudinary.com/pesto-matrimony/image/upload/v1662458482/tufqrbcs4pnkwcukvynw.png`;
        // If Not sent Interest before, then...
        // put the interest object in interestsSent array of User1
        user1.interestsSent.push({
            conversations: [],
            interestSenderAge: user1.age,
            interestSenderId: user1.oktaUserId,
            interestSenderImage: user1.images[0] || user1.gender === 'male' ? maleImagePlaceholder : femaleImagePlaceholder,
            interestSenderName: user1.name,
            interestReceiverAge: user2.age,
            interestReceiverId: user2.oktaUserId,
            interestReceiverImage: user2.images[0] || user2.gender === 'male' ? maleImagePlaceholder : femaleImagePlaceholder,
            interestReceiverName: user2.name,
            isAccepted: false,
            isRejected: false,
        });
        // Also...
        // Put the same interest object in interestsReceived array of User2
        user2.interestsReceived.push({
            conversations: [],
            interestSenderAge: user1.age,
            interestSenderId: user1.oktaUserId,
            interestSenderImage: user1.images[0] || user1.gender === 'male' ? maleImagePlaceholder : femaleImagePlaceholder,
            interestSenderName: user1.name,
            interestReceiverAge: user2.age,
            interestReceiverId: user2.oktaUserId,
            interestReceiverImage: user2.images[0] || user2.gender === 'male' ? maleImagePlaceholder : femaleImagePlaceholder,
            interestReceiverName: user2.name,
            isAccepted: false,
            isRejected: false,
        });
        /**=============================================================== */
        yield user1.save();
        yield user2.save();
        yield session.commitTransaction();
        session.endSession();
        res.status(200).json({
            success: true,
            message: 'Interest sent!',
        });
    }
    catch (error) {
        // If an error occurred, abort the whole transaction and
        // undo any changes that might have happened
        // console.log(error);
        yield session.abortTransaction();
        session.endSession();
        return next(new CustomErrorResponse('Interest not sent. Please try later!', 500));
    }
}));
// @desc   Accept an Interest
// @route  PUT /api/v1/interests/accept?sender=oktaUserId1&receiver=oktaUserId2
// @access Private
// In One go... isAccepted property in interest object must be updated to "true" for
// both sender and receiver.
// User1 is interest Sender. Interest object will be in interestsSent array of User 1
// User2 is interest Receiver. Interest object will be in interestsReceived array of User 2
// User2 can accept interest. Because User2 "received" the interest.
// When he does that... update isAccepted to "true" for both
exports.acceptInterest = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const oktaUserId1 = req.query.sender;
    const oktaUserId2 = req.query.receiver;
    const session = yield User.startSession();
    try {
        session.startTransaction();
        let user1 = yield User.find({ oktaUserId: oktaUserId1 });
        user1 = user1[0];
        let user2 = yield User.find({ oktaUserId: oktaUserId2 });
        user2 = user2[0];
        /**=============================================================== */
        user2.interestsReceived = user2.interestsReceived.map((interest) => {
            // First identify the interest object which must be updated.
            if (String(interest.interestSenderId) === user1.oktaUserId) {
                interest.isAccepted = true;
            }
            return interest;
        });
        // Also...
        // Put update same interest object in interestsSent array of User1
        user1.interestsSent = user1.interestsSent.map((interest) => {
            // First identify the interest object to be updated.
            if (String(interest.interestReceiverId) === user2.oktaUserId) {
                interest.isAccepted = true;
            }
            return interest;
        });
        /**=============================================================== */
        yield user1.save();
        yield user2.save();
        yield session.commitTransaction();
        session.endSession();
        res.status(200).json({
            success: true,
            message: 'Interest accepted!',
        });
    }
    catch (error) {
        // If an error occurred, abort the whole transaction and
        // undo any changes that might have happened
        // console.log(error);
        yield session.abortTransaction();
        session.endSession();
        return next(new CustomErrorResponse('Error accepting interest. Please try later!', 500));
    }
}));
// @desc   Decline an Interest
// @route  PUT /api/v1/interests/decline?sender=oktaUserId1&receiver=oktaUserId2
// @access Private
// Receiver of an interest can decline an interest.
// User 1 is sender & User 2 is receiver.
// So, update isRejected to "true" in interest object in interestsReceived array of User2
// Also, update isRejected to "true" in interest object in interestsSent array of User1
exports.declineInterest = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const oktaUserId1 = req.query.sender;
    const oktaUserId2 = req.query.receiver;
    const session = yield User.startSession();
    try {
        session.startTransaction();
        let user1 = yield User.find({ oktaUserId: oktaUserId1 });
        user1 = user1[0];
        let user2 = yield User.find({ oktaUserId: oktaUserId2 });
        user2 = user2[0];
        /**=============================================================== */
        user2.interestsReceived = user2.interestsReceived.map((interest) => {
            // First identify the interest object which must be updated.
            if (String(interest.interestSenderId) === user1.oktaUserId) {
                interest.isRejected = true;
            }
            return interest;
        });
        // Also...
        // Put update same interest object in interestsSent array of User1
        user1.interestsSent = user1.interestsSent.map((interest) => {
            // First identify the interest object to be updated.
            if (String(interest.interestReceiverId) === user2.oktaUserId) {
                interest.isRejected = true;
            }
            return interest;
        });
        /**=============================================================== */
        yield user1.save();
        yield user2.save();
        yield session.commitTransaction();
        session.endSession();
        res.status(200).json({
            success: true,
            message: 'Interest rejected!',
        });
    }
    catch (error) {
        // If an error occurred, abort the whole transaction and
        // undo any changes that might have happened
        // console.log(error);
        yield session.abortTransaction();
        session.endSession();
        return next(new CustomErrorResponse('Error rejecting interest. Please try later!', 500));
    }
}));
// @desc   Cancel an Interest
// @route  PUT /api/v1/interests/cancel?sender=oktaUserId1&receiver=oktaUserId2
// @access Private
exports.cancelInterest = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const oktaUserId1 = req.query.sender;
    const oktaUserId2 = req.query.receiver;
    const session = yield User.startSession();
    try {
        session.startTransaction();
        let user1 = yield User.find({ oktaUserId: oktaUserId1 });
        user1 = user1[0];
        let user2 = yield User.find({ oktaUserId: oktaUserId2 });
        user2 = user2[0];
        /**=============================================================== */
        // Remove sent interest from user1's interestsSent array and
        // Remove received interest from user2's interestsReceived array
        // Only an unaccepted interest can be cancelled.
        user1.interestsSent = user1.interestsSent.filter((interest) => {
            if (interest.isAccepted === false && interest.interestReceiverId === oktaUserId2) {
                return false;
            }
            return true;
        });
        user2.interestsReceived = user2.interestsReceived.filter((interest) => {
            if (interest.isAccepted === false && interest.interestSenderId === oktaUserId1) {
                return false;
            }
            return true;
        });
        /**=============================================================== */
        yield user1.save();
        yield user2.save();
        yield session.commitTransaction();
        session.endSession();
        res.status(200).json({
            success: true,
            message: 'Interest Cancelled!',
        });
    }
    catch (error) {
        // If an error occurred, abort the whole transaction and
        // undo any changes that might have happened
        // console.log(error);
        yield session.abortTransaction();
        session.endSession();
        return next(new CustomErrorResponse('Could not cancel interest. Please try later!', 500));
    }
}));


/***/ }),

/***/ "./apps/pm-backend/src/controllers/recommendations.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const tslib_1 = __webpack_require__("tslib");
const asyncHandler = __webpack_require__("./apps/pm-backend/src/middleware/async.js");
const User = __webpack_require__("./apps/pm-backend/src/models/Users.js");
const CustomErrorResponse = __webpack_require__("./apps/pm-backend/src/utilities/errorResponse.js");
// @desc   Get Recommendations
// @route  GET /api/v1/recommendations/:oktaUserId
// @access Private
exports.getRecommendations = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = yield User.find({ oktaUserId: req.params.oktaUserId });
        if (!currentUser) {
            return next(new CustomErrorResponse(`User not found!`, 404));
        }
        const currentUserGender = currentUser[0].gender;
        const currentUserAge = currentUser[0].age;
        const currentUserReligion = currentUser[0].religion;
        const profiles = yield User.find({ gender: { $ne: currentUserGender } }).exec();
        //Recommendations based on gender, age and religion
        const recommendations = profiles.filter((profile) => {
            return ((currentUserGender === 'male' ? profile.age <= currentUserAge : profile.age >= currentUserAge) &&
                (currentUserReligion ? profile.religion === currentUserReligion : true));
        });
        console.log('No. of Recommendations: ', recommendations.length);
        if (recommendations.length < 1) {
            res.status(200).json({
                success: false,
                message: 'Recommendations not found. Please update your age and religion to get recommendations.',
                number: recommendations.length,
                data: recommendations,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Recommendations found.',
            number: recommendations.length,
            data: recommendations,
        });
    }
    catch (error) {
        return next(new CustomErrorResponse('Error!. Please try later!', 500));
    }
}));


/***/ }),

/***/ "./apps/pm-backend/src/controllers/search.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const tslib_1 = __webpack_require__("tslib");
const asyncHandler = __webpack_require__("./apps/pm-backend/src/middleware/async.js");
const User = __webpack_require__("./apps/pm-backend/src/models/Users.js");
const CustomErrorResponse = __webpack_require__("./apps/pm-backend/src/utilities/errorResponse.js");
const MINIMUM_HEIGHT_IN_CMS = 122;
const MAXIMUM_HEIGHT_IN_CMS = 214;
const MINIMUM_ALLOWED_AGE = 21;
const MAXIMUM_ALLOWED_AGE = 50;
// @desc   Search Profiles
// @route  POST /api/v1/users/search/:oktaUserId
// @access Private
exports.searchProfiles = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('search route has been hit...');
        const currentUser = yield User.find({ oktaUserId: req.params.oktaUserId });
        console.log(req.body);
        if (!currentUser) {
            return next(new CustomErrorResponse(`User not found!`, 404));
        }
        const currentUserGender = currentUser[0].gender;
        const searchCriteria = req.body;
        console.log(searchCriteria);
        // Remove properties with 'undefined' & "null" values before perfmorming search in DB
        Object.keys(searchCriteria).forEach((key) => {
            if (searchCriteria[key] === undefined || searchCriteria[key] === null) {
                delete searchCriteria[key];
            }
        });
        const { ageRange, city, country, heightRange, religion, marriageStatus, motherTongue, state } = searchCriteria;
        const minAge = ageRange === undefined ? MINIMUM_ALLOWED_AGE : ageRange[0];
        const maxAge = ageRange === undefined ? MAXIMUM_ALLOWED_AGE : ageRange[1];
        const minHeight = heightRange === undefined ? MINIMUM_HEIGHT_IN_CMS : heightRange[0];
        const maxHeight = heightRange === undefined ? MAXIMUM_HEIGHT_IN_CMS : heightRange[1];
        // get profiles of opposite gender.
        const profiles = yield User.find({ gender: { $ne: currentUserGender } }).exec();
        // filter opposite gender profiles as per search preferences.
        const matchingProfiles = profiles.filter((profile) => {
            return (profile.age >= minAge &&
                profile.age <= maxAge &&
                profile.height >= minHeight &&
                profile.height <= maxHeight &&
                (city ? profile.location === city : true) &&
                (country ? profile.country === country : true) &&
                (motherTongue ? profile.motherTongue === motherTongue : true) &&
                (marriageStatus ? profile.marriageStatus === marriageStatus : true) &&
                (religion ? profile.religion === religion : true) &&
                (state ? profile.state === state : true));
        });
        console.log('No. of Matches: ', matchingProfiles.length);
        if (matchingProfiles.length < 1) {
            res.status(200).json({
                success: false,
                message: 'Matches not found. Please adjust your search criteria',
                number: matchingProfiles.length,
                data: matchingProfiles,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Matches found.',
            number: matchingProfiles.length,
            data: matchingProfiles,
        });
    }
    catch (error) {
        return next(new CustomErrorResponse('Error!. Please try later!', 500));
    }
}));


/***/ }),

/***/ "./apps/pm-backend/src/controllers/shortlist.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const tslib_1 = __webpack_require__("tslib");
const asyncHandler = __webpack_require__("./apps/pm-backend/src/middleware/async.js");
const User = __webpack_require__("./apps/pm-backend/src/models/Users.js");
const CustomErrorResponse = __webpack_require__("./apps/pm-backend/src/utilities/errorResponse.js");
const okta = __webpack_require__("@okta/okta-sdk-nodejs");
// @desc   Shortlist Profiles
// @route  PUT /api/v1/toggleShortlist?shortlister=oktaUserId1&shorlistee=oktaUserId2
// @access Private
exports.toggleShortlist = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const shortlisterOktaId = req.query.shortlister;
    const shortlisteeOktaId = req.query.shortlistee;
    console.log(shortlisterOktaId);
    console.log(shortlisteeOktaId);
    try {
        // user who wants to shortlist
        let shortlister = yield User.find({ oktaUserId: shortlisterOktaId });
        shortlister = shortlister[0];
        const { shortlistedMatches } = shortlister;
        // user who is being shortlisted
        let shortlistee = yield User.find({ oktaUserId: shortlisteeOktaId });
        shortlistee = shortlistee[0];
        // Did shortlister already shortlist shortlistee ?
        const wasAlreadyShortlisted = shortlister.shortlistedMatches.some((oktaId) => oktaId === shortlisteeOktaId);
        // console.log(wasAlreadyShortlisted);
        if (wasAlreadyShortlisted) {
            // If Yes... then remove from shortlist
            shortlister.shortlistedMatches = shortlister.shortlistedMatches.filter((oktaId) => oktaId !== shortlisteeOktaId);
        }
        else {
            // If No, then shortlist
            shortlister.shortlistedMatches = [...shortlistedMatches, shortlisteeOktaId];
        }
        yield shortlister.save();
        const message = wasAlreadyShortlisted
            ? `${shortlistee.name} has been removed from your shortlist`
            : `${shortlistee.name} was added to your shortlisted profiles`;
        res.status(200).json({
            success: true,
            message,
        });
    }
    catch (error) {
        return next(new CustomErrorResponse('Please try later', 500));
    }
}));


/***/ }),

/***/ "./apps/pm-backend/src/controllers/users.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const tslib_1 = __webpack_require__("tslib");
const asyncHandler = __webpack_require__("./apps/pm-backend/src/middleware/async.js");
const User = __webpack_require__("./apps/pm-backend/src/models/Users.js");
const CustomErrorResponse = __webpack_require__("./apps/pm-backend/src/utilities/errorResponse.js");
const okta = __webpack_require__("@okta/okta-sdk-nodejs");
// @desc   Register a new Profile
// @route  POST /api/v1/users/
// @access Public
/** ----------------------------------------- */
//signing up user into okta
exports.oktaSignUp = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const client = new okta.Client({
        orgUrl: 'https://dev-42684472.okta.com/',
        token: '00TW3soK2Eq883PaRVu5rjqRniqE6iaueZOivSe91P',
    });
    const body = req.body;
    // async function createUserInOkta() {
    const response = yield client.createUser(body);
    //will update it with destructure
    const oktaId = response.id;
    const name = `${response.profile.firstName} ${response.profile.lastName}`;
    const gender = response.profile.gender;
    const email = response.profile.email;
    const mongoUser = {
        oktaUserId: oktaId,
        name,
        gender,
        email,
    };
    //creting user in mongo db with data from the okta
    const user = yield User.create(mongoUser);
    res.status(200).send({
        res: user,
    });
}));
//find user in mongodb by oktaId
function findUserByOktaId(oktaId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const currentUser = yield User.find({ oktaUserId: oktaId });
        return currentUser;
    });
}
//getting userPrifileData
exports.getUserProfile = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const params = req.params;
    const oktaId = params.id;
    const currentUser = yield findUserByOktaId(oktaId);
    // const currentUser = await User.find({ oktaUserId: oktaId });
    if (!currentUser) {
        return next(new CustomErrorResponse(`User not found!`, 404));
    }
    res.status(200).json({ currentUser });
}));
//to upload image in mongodb
exports.uploadImageToMongoDb = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const imageUrl = req.body.imageUrlString;
    const currentUserId = req.body.oktaUserId;
    const currentUser = yield findUserByOktaId(currentUserId);
    // console.log(currentUser[0].images);
    const imageUrls = currentUser[0].images;
    if (!currentUser) {
        return next(new CustomErrorResponse(`User not found!`, 404));
    }
    yield User.updateOne({ oktaUserId: currentUserId }, { images: [...imageUrls, imageUrl] });
    res.status(200).json({ status: 'success' });
}));
/** ----------------------------------------- */
exports.updateUserProfile = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.params.userId;
    //getting mongodbId using oktaUserId
    // const user = await findUserByOktaId(currentUserId);
    // const mongoId = user[0]._id.toString()
    // console.log(mongoId);
    const body = req.body;
    if (!body) {
        return next(new CustomErrorResponse(`req.body is empty`, 400));
    }
    if (!currentUserId) {
        return next(new CustomErrorResponse(`Can't update data of non-existent user`, 400));
    }
    yield User.updateOne({ oktaUserId: currentUserId }, { $set: body });
    res.status(200).json({
        success: true,
        message: 'Updated User successfully',
        data: 'user',
    });
}));
/** ----------------------------------------- */
// @desc   Search Profiles
// @route  GET /api/v1/users/search/
// @access Private
exports.searchProfiles = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const searchCriteria = req.body;
    // NOTE : WORK IN PROGRESS....
    // Remove properties with 'undefined' values before perfmorming search in DB
    Object.keys(searchCriteria).forEach((key) => {
        if (searchCriteria[key] === undefined) {
            delete searchCriteria[key];
        }
    });
    let matchingProfiles = yield User.find({ name: 'john', age: { $gte: 18 } }).exec();
    // console.log(matchingProfiles);
    if (matchingProfiles.length < 1) {
        return next(new CustomErrorResponse(`Could not find matching profiles`, 400));
    }
    res.status(200).json({
        success: true,
        message: 'Updated User successfully',
        data: matchingProfiles,
    });
}));
exports.deleteImage = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const currentUserOktaId = req.params.userId;
    const imageArrayIndex = req.params.index;
    //geting currentUserData by OktaUserId
    const currentUserProfile = yield findUserByOktaId(currentUserOktaId);
    //image deleting logic
    currentUserProfile[0].images.splice(imageArrayIndex, 1);
    yield User.updateOne({ oktaUserId: currentUserOktaId }, { images: currentUserProfile[0].images });
    res.status(200).json({
        success: true,
        message: 'Deleted user successfully',
        data: 'user'
    });
    res.status(400).json({
        success: false,
        message: 'Image is not deleted',
        error: err
    });
    // //geting currentUserData by OktaUserId
    // const currentUserProfile = await findUserByOktaId(currentUserOktaId);
    // //image deleting logic
    // currentUserProfile[0].images.splice(imageArrayIndex, 1);
    // await User.updateOne({ oktaUserId: currentUserOktaId }, { images: currentUserProfile[0].images });
    // res.status(200).json({
    //   success: true,
    //   message: 'Deleted user successfully',
    //   data: 'user'
    // });
}));


/***/ }),

/***/ "./apps/pm-backend/src/main.js":
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

const cors = __webpack_require__("cors");
const express = __webpack_require__("express");
const dbConnection = __webpack_require__("./apps/pm-backend/src/config/database.js");
const errorHandler = __webpack_require__("./apps/pm-backend/src/middleware/error.js");
const bodyParser = __webpack_require__("body-parser");
const Sentry = __webpack_require__("./node_modules/@sentry/node/esm/index.js");
const Tracing = __webpack_require__("./node_modules/@sentry/tracing/esm/index.js");
// Connect to MongoDB
dbConnection();
// Start Express Server
const app = express();
// *****************Sentry Code Start*****************
Sentry.init({
    dsn: 'https://e1d7d0bf5be74e7b99f42b24a991095a@o1408574.ingest.sentry.io/6744194',
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});
// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());
// *****************Sentry Code End*****************
app.use(cors());
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// importing routes
const admin = __webpack_require__("./apps/pm-backend/src/routes/admin.js");
const conversations = __webpack_require__("./apps/pm-backend/src/routes/conversations.js");
const interests = __webpack_require__("./apps/pm-backend/src/routes/interests.js");
const recommendations = __webpack_require__("./apps/pm-backend/src/routes/recommendations.js");
const search = __webpack_require__("./apps/pm-backend/src/routes/search.js");
const toggleShortlist = __webpack_require__("./apps/pm-backend/src/routes/shortlist.js");
const users = __webpack_require__("./apps/pm-backend/src/routes/users.js");
// mounting routes
app.use('/api/v1/admin', admin);
app.use('/api/v1/conversations', conversations);
app.use('/api/v1/interests', interests);
app.use('/api/v1/recommendations', recommendations);
app.use('/api/v1/search', search);
app.use('/api/v1/toggleShortlist', toggleShortlist);
app.use('/api/v1/users', users);
console.log('mounting routes completed...');
// *****************Sentry Related*****************
// Sentry Error Handler
// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());
// *****************Sentry Related*****************
// Custom Error Handler
//Handling Unhandled routes. it should be placed after the routes.
// app.all('*', (req, res, next) => {
//   res.status(404).json({
//     status: 'fail',
//     message: `Can't find ${req.originalUrl} on this server !`,
//   });
// });
// error Handling middlewre.
app.use(errorHandler);
const server = app.listen(process.env.PORT || 8000, console.log(`Server is listening on port : ${process.env.PORT || 8000}\nMode: ${"development".toUpperCase()}`));
// Error in connecting to MongoDB triggers unhandledRejection at global level
// That is being handled here. This stops server if MongoDB is NOT connected.
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});


/***/ }),

/***/ "./apps/pm-backend/src/middleware/async.js":
/***/ ((module) => {

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
module.exports = asyncHandler;
// This asyncHanlder() will wrap around all controller methods which do DB operations...
// If there is an error in DB Operation, asyncHandler() catches that error...
// Then passes it to errorHandler() middleware...
// Then the errorHandler middleware gives JSON as response.


/***/ }),

/***/ "./apps/pm-backend/src/middleware/error.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// All Errors in this Express Application come here...
// as errorHandler() is middleware function...
// This helps send a customized response after identifying the error.
const ErrorResponse = __webpack_require__("./apps/pm-backend/src/utilities/errorResponse.js");
const errorHandler = (err, req, res, next) => {
    let error = Object.assign({}, err);
    error.message = err.message;
    console.log(error);
    // Duplicate Phone/Email Used while Registration
    if (err.code === 11000) {
        const message = `Email / Phone already used for registration.`;
        error = new ErrorResponse(message, 400); // 400 = bad request
    }
    if (err.code === 'E0000001') {
        const message = `password: This password was found in a list of commonly used passwords. Please try another password.`;
        error = new ErrorResponse(message, 400); // 400 = bad request
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message);
        console.log(message);
        error = new ErrorResponse(message.join(' & '), 400);
    }
    res.json({
        success: false,
        error: error.message || 'Server Error',
    });
};
module.exports = errorHandler;


/***/ }),

/***/ "./apps/pm-backend/src/models/Users.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const mongoose = __webpack_require__("mongoose");
const MessageSchema = new mongoose.Schema({
    messageSenderId: {
        type: String,
        trim: true,
    },
    messageReceiverId: {
        type: String,
        trim: true,
    },
    message: {
        type: String,
        trim: true,
        maxlength: [500, 'Message can not be more than 500 characters'],
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    timeStamp: {
        type: Date,
        default: Date.now,
    },
});
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is missing!'],
        maxlength: [50, 'Name can not be more than 50 characters'],
    },
    gender: {
        type: String,
        required: [true, 'Gender is missing!'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is missing!'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    },
    oktaUserId: {
        type: String,
        unique: true,
        required: [true, 'Okta User Id is missing !'],
    },
    images: {
        type: [String],
        default: [],
    },
    // Personal Information
    aboutMe: {
        type: String,
        trim: true,
        default: '',
    },
    age: {
        type: Number,
        trim: true,
        default: 21,
    },
    height: {
        type: Number,
        trim: true,
        default: 140,
    },
    weight: {
        type: Number,
        trim: true,
    },
    physique: {
        type: String,
        default: '',
        trim: true,
    },
    motherTongue: {
        type: String,
        trim: true,
        default: '',
    },
    marriageStatus: {
        type: String,
        trim: true,
        default: '',
    },
    citizenship: {
        type: String,
        trim: true,
        default: '',
    },
    country: {
        type: String,
        trim: true,
        default: '',
    },
    state: {
        type: String,
        trim: true,
        default: '',
    },
    location: {
        type: String,
        trim: true,
        default: '',
    },
    eatingHabits: {
        type: String,
        trim: true,
        default: '',
    },
    smokingHabits: {
        type: String,
        trim: true,
        default: '',
    },
    drinkingHabits: {
        type: String,
        trim: true,
        default: '',
    },
    hobbies: {
        type: [String],
        default: [],
    },
    spokenLanguages: {
        type: [String],
        default: [],
    },
    // Education & Occupation Details
    employer: {
        type: String,
        default: '',
    },
    income: {
        type: Number,
    },
    occupation: {
        type: String,
        default: '',
    },
    qualification: {
        type: String,
        default: '',
    },
    // Family Details
    aboutFamily: {
        type: String,
        default: '',
    },
    brothers: {
        type: Number,
    },
    familyStatus: {
        type: String,
        default: '',
    },
    marriedBrothers: {
        type: Number,
    },
    marriedSisters: {
        type: Number,
    },
    sisters: {
        type: Number,
    },
    // Religious Details
    dateOfBirth: {
        type: String,
        trim: true,
        default: '',
    },
    timeOfBirth: {
        type: String,
        trim: true,
        default: '',
    },
    gothram: {
        type: String,
        trim: true,
        default: '',
    },
    placeOfBirth: {
        type: String,
        trim: true,
        default: '',
    },
    religion: {
        type: String,
        trim: true,
    },
    zodiacSign: {
        type: String,
        trim: true,
        default: '',
    },
    // Preference Details
    partnerAgeRange: {
        type: [Number],
        default: [21, 50],
    },
    partnerCountry: {
        type: String,
        default: '',
    },
    partnerEatingHabits: {
        type: String,
        trim: true,
        default: '',
    },
    partnerHeightRange: {
        type: [Number],
        default: [],
    },
    partnerIncomeRange: {
        type: [Number],
        default: [],
    },
    partnerMaritalStatus: {
        type: String,
        trim: true,
        default: '',
    },
    partnerMotherTongue: {
        type: String,
        trim: true,
        default: '',
    },
    partnerReligion: {
        type: String,
        trim: true,
        default: '',
    },
    phone: {
        type: String,
        default: '',
        trim: true,
        maxlength: [20, 'Phone number can not be longer than 20 characters'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin'],
    },
    //store Ids of all shortlisted users.
    shortlistedMatches: {
        type: [String],
        default: [],
    },
    // for each interest received... a unique object is created.
    // Subsequent messages "to & from" the sender are stored in conversations array inside the object.
    interestsReceived: [
        {
            interestSenderAge: { type: Number },
            interestSenderId: { type: String },
            interestSenderImage: { type: String },
            interestSenderName: { type: String },
            interestReceiverAge: { type: Number },
            interestReceiverId: { type: String },
            interestReceiverImage: { type: String },
            interestReceiverName: { type: String },
            isAccepted: { type: Boolean, default: false },
            isRejected: { type: Boolean, default: false },
            conversations: [MessageSchema],
        },
    ],
    // for each interest sent... a unique object is created...
    // Subsequent messages "to & from" the receiver are stored in conversations array inside the object
    interestsSent: [
        {
            interestSenderAge: { type: Number },
            interestSenderId: { type: String },
            interestSenderImage: { type: String },
            interestSenderName: { type: String },
            interestReceiverAge: { type: Number },
            interestReceiverId: { type: String },
            interestReceiverImage: { type: String },
            interestReceiverName: { type: String },
            isAccepted: { type: Boolean, default: false },
            isRejected: { type: Boolean, default: false },
            conversations: [MessageSchema],
        },
    ],
});
module.exports = mongoose.model('User', UserSchema);


/***/ }),

/***/ "./apps/pm-backend/src/routes/admin.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const express = __webpack_require__("express");
//importing controllers
const { getAllUsersProfiles } = __webpack_require__("./apps/pm-backend/src/controllers/admin.js");
const router = express.Router();
//getting all users of pesto-matrimony
router.route('/getallusers').get(getAllUsersProfiles);
module.exports = router;


/***/ }),

/***/ "./apps/pm-backend/src/routes/conversations.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const express = __webpack_require__("express");
const { getMessages, sendMessage, markMessagesAsRead } = __webpack_require__("./apps/pm-backend/src/controllers/conversations.js");
const router = express.Router();
// '/' in this router is equivalent to  '/api/v1/conversations'
// A message is an object in conversations array.
// All of these controller functions are working on that conversations array.
router.route('/').post(sendMessage).put(markMessagesAsRead);
router.route('/:oktaUserId').get(getMessages);
module.exports = router;


/***/ }),

/***/ "./apps/pm-backend/src/routes/interests.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const express = __webpack_require__("express");
const { acceptInterest, cancelInterest, declineInterest, sendInterest } = __webpack_require__("./apps/pm-backend/src/controllers/interests.js");
const router = express.Router();
// '/' in this router is equivalent to  '/api/v1/interests'
router.route('/').post(sendInterest);
router.route('/accept').put(acceptInterest);
router.route('/cancel').put(cancelInterest);
router.route('/decline').put(declineInterest);
module.exports = router;


/***/ }),

/***/ "./apps/pm-backend/src/routes/recommendations.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const express = __webpack_require__("express");
const router = express.Router();
const { getRecommendations } = __webpack_require__("./apps/pm-backend/src/controllers/recommendations.js");
// '/' in this router is equivalent to  '/api/v1/recommendations'
router.route('/:oktaUserId').get(getRecommendations);
module.exports = router;


/***/ }),

/***/ "./apps/pm-backend/src/routes/search.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const express = __webpack_require__("express");
const router = express.Router();
const { searchProfiles } = __webpack_require__("./apps/pm-backend/src/controllers/search.js");
// '/' in this router is equivalent to  '/api/v1/search'
router.route('/:oktaUserId').post(searchProfiles);
module.exports = router;


/***/ }),

/***/ "./apps/pm-backend/src/routes/shortlist.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const express = __webpack_require__("express");
const router = express.Router();
const { toggleShortlist } = __webpack_require__("./apps/pm-backend/src/controllers/shortlist.js");
// '/' in this router is equivalent to  '/api/v1/toggleShortlist'
router.route('/').put(toggleShortlist);
module.exports = router;


/***/ }),

/***/ "./apps/pm-backend/src/routes/users.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const express = __webpack_require__("express");
const { getUserProfile, uploadImageToMongoDb, updateUserProfile, oktaSignUp, searchProfiles, deleteImage } = __webpack_require__("./apps/pm-backend/src/controllers/users.js");
const router = express.Router();
// '/' in this router is equivalent to  '/api/v1/users'
// Signup
router.route('/oktasignup').post(oktaSignUp);
router.route('/userprofile/:id').get(getUserProfile);
router.route('/imageupload').post(uploadImageToMongoDb);
//it was running for the admin
// router.route('/getallusers').get(getAllUsersProfiles)
// Update / Delete
router.route('/:userId').put(updateUserProfile);
// Fetch User Profiles
router.route('/search').get(searchProfiles);
router.route('/delete-image/:userId/:index').delete(deleteImage);
// Have to create another route & controller function for...
// handling search and filters with pagination..
// This route will have a lot of complex logic.
// updateUserProfile will only be used to update Profile details...
// NOT messages... although it is possible...
// For message flow... a separate route (conversations) is present
// Update
router.route('/:userId').put(updateUserProfile);
module.exports = router;


/***/ }),

/***/ "./apps/pm-backend/src/utilities/errorResponse.js":
/***/ ((module) => {

class CustomErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
module.exports = CustomErrorResponse;


/***/ }),

/***/ "@okta/okta-sdk-nodejs":
/***/ ((module) => {

"use strict";
module.exports = require("@okta/okta-sdk-nodejs");

/***/ }),

/***/ "body-parser":
/***/ ((module) => {

"use strict";
module.exports = require("body-parser");

/***/ }),

/***/ "cookie":
/***/ ((module) => {

"use strict";
module.exports = require("cookie");

/***/ }),

/***/ "cors":
/***/ ((module) => {

"use strict";
module.exports = require("cors");

/***/ }),

/***/ "express":
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "https-proxy-agent":
/***/ ((module) => {

"use strict";
module.exports = require("https-proxy-agent");

/***/ }),

/***/ "mongoose":
/***/ ((module) => {

"use strict";
module.exports = require("mongoose");

/***/ }),

/***/ "tslib":
/***/ ((module) => {

"use strict";
module.exports = require("tslib");

/***/ }),

/***/ "child_process":
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "domain":
/***/ ((module) => {

"use strict";
module.exports = require("domain");

/***/ }),

/***/ "fs":
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "os":
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "stream":
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "url":
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__(__webpack_require__.s = "./apps/pm-backend/src/main.js");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map