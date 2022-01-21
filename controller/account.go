package controller

import (
	"douban-webend/config"
	"douban-webend/model"
	"douban-webend/service"
	"douban-webend/utils"
	"encoding/json"
	"fmt"
	"net/http"
)

// CtrlBaseRegister controller 层所有函数均返回 (err error, resp utils.RespData)
func CtrlBaseRegister(account, token, kind string) (err error, resp utils.RespData) {
	err = nil

	var accessToken, refreshToken string
	var uid int64

	switch kind {
	case "password":
		err, accessToken, refreshToken, uid = service.RegisterAccountFromUsername(account, token)
	case "email":
		err, accessToken, refreshToken, uid = service.RegisterAccountFromEmail(account, token)
	case "sms":
		err, accessToken, refreshToken, uid = service.RegisterAccountFromSms(account, token)
	}

	if err != nil {
		return err, utils.RespData{}
	}

	resp = utils.RespData{
		HttpStatus: http.StatusOK,
		Status:     20000,
		Info:       "success",
		Data: struct {
			AccessToken  string `json:"access_token"`
			RefreshToken string `json:"refresh_token"`
			Uid          int64  `json:"uid"`
		}{
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
			Uid:          uid,
		},
	}
	return
}

const (
	GiteeCode  = "https://gitee.com/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code&scope=user_info"
	GitHubCode = ""

	GiteeToken       = "https://gitee.com/oauth/token?grant_type=authorization_code&code=%s&client_id=%s&redirect_uri=%s&client_secret=%s"
	GiteeRedirectUri = "http://%s/oauth/gitee"
	GiteeOpenAPIUser = "https://gitee.com/api/v5/user/"
)

func CtrlOAuthLogin(code, platform string) (err error, resp utils.RespData) {

	err = nil

	var accessToken, refreshToken string
	var uid int64

	var info model.OAuthInfo

	switch platform {
	case "gitee":
		postUrl := fmt.Sprintf(GiteeToken, code, config.Config.GiteeOauthClientId, fmt.Sprintf(GiteeRedirectUri, config.Config.ServerIp), config.Config.GiteeOauthClientSecret)
		tokenChan := utils.GetPOSTBytesWithEmptyBody(postUrl)
		var token struct {
			AccessToken string `json:"access_token"`
		}
		tokenJson := <-tokenChan
		if len(tokenJson) == 0 {
			return utils.ServerInternalError, utils.RespData{}
		}
		err = json.Unmarshal(tokenJson, &token)
		if err != nil {
			return
		}
		infoCh := utils.GetGETBytes(GiteeOpenAPIUser+"?access_token="+token.AccessToken, nil)
		infoJson := <-infoCh
		if len(infoJson) == 0 {
			return utils.ServerInternalError, utils.RespData{}
		}
		err = json.Unmarshal(infoJson, &info)
		if err != nil || info.OAuthId == 0 {
			return utils.ServerInternalError, utils.RespData{}
		}
		info.PlatForm = platform
		err, accessToken, refreshToken, uid = service.LoginAccountFromGitee(info)
	case "github":

		info.PlatForm = platform
		err, accessToken, refreshToken, uid = service.LoginAccountFromGithub(info)
	}

	resp = utils.RespData{
		HttpStatus: http.StatusOK,
		Status:     20000,
		Info:       "success",
		Data: struct {
			AccessToken  string `json:"access_token"`
			RefreshToken string `json:"refresh_token"`
			Uid          int64  `json:"uid"`
		}{
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
			Uid:          uid,
		},
	}

	return
}