package main

import (
	"encoding/json"
	"net/http"
	"sync"
	"strconv"
	"github.com/pkg/errors"
	"github.com/mattermost/mattermost-server/v5/plugin"
)

const (
	routeAPISettingsInfo                        = "/api/v2/settingsinfo"
)

// Plugin implements the interface expected by the Mattermost server to communicate between the server and plugin processes.
type Plugin struct {
	plugin.MattermostPlugin

	// configurationLock synchronizes access to the configuration.
	configurationLock sync.RWMutex

	// configuration is the active plugin configuration. Consult getConfiguration and
	// setConfiguration for usage.
	configuration *configuration
}

func (p *Plugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	status, err := p.serveHTTP(c, w, r)
	if err != nil {
		p.API.LogError("ERROR: ", "Status", strconv.Itoa(status), "Error", err.Error(), "Host", r.Host, "RequestURI", r.RequestURI, "Method", r.Method, "query", r.URL.Query().Encode())
	}
	p.API.LogDebug("OK: ", "Status", strconv.Itoa(status), "Host", r.Host, "RequestURI", r.RequestURI, "Method", r.Method, "query", r.URL.Query().Encode())
}

func (p *Plugin) serveHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) (int, error) {
	path := r.URL.Path

	switch path {
		case routeAPISettingsInfo:
          return p.httpGetSettingsInfo(w, r)
		}

	return respondErr(w, http.StatusNotFound, errors.New("not found"))
}

func (p *Plugin) httpGetSettingsInfo(w http.ResponseWriter, r *http.Request) (int, error) {
	if r.Method != http.MethodGet {
		return respondErr(w, http.StatusMethodNotAllowed,
			errors.New("method "+r.Method+" is not allowed, must be GET"))
	}

	mattermostUserId := r.Header.Get("Mattermost-User-Id")
	if mattermostUserId == "" {
		return respondErr(w, http.StatusUnauthorized,
			errors.New("not authorized"))
	}

	return respondJSON(w, p.getConfiguration());
}

func respondErr(w http.ResponseWriter, code int, err error) (int, error) {
	http.Error(w, err.Error(), code)
	return code, err
}

func respondJSON(w http.ResponseWriter, obj interface{}) (int, error) {
	data, err := json.Marshal(obj)
	if err != nil {
		return respondErr(w, http.StatusInternalServerError, errors.WithMessage(err, "failed to marshal response"))
	}
	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(data)
	if err != nil {
		return http.StatusInternalServerError, errors.WithMessage(err, "failed to write response")
	}
	return http.StatusOK, nil
}