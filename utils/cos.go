package utils

import (
	"context"
	"douban-webend/config"
	"github.com/tencentyun/cos-go-sdk-v5"
	"io"
	"log"
	"net/http"
	"net/url"
	"time"
)

// 腾讯云 cos 工具类

func UploadFile(bucketUrl string, path string, r io.Reader) {
	u, _ := url.Parse(bucketUrl)
	b := &cos.BaseURL{BucketURL: u}
	c := cos.NewClient(b, &http.Client{
		//设置超时时间
		Timeout: 30 * time.Second,
		Transport: &cos.AuthorizationTransport{
			SecretID:  config.Config.TencentSecretId,
			SecretKey: config.Config.TencentSecretKey,
		},
	})

	_, err := c.Object.Put(context.Background(), path, r, nil)
	if err != nil {
		log.Println(err)
	}
}

func UploadFileFromLocal(bucketUrl, toPath, filePath string) {
	u, _ := url.Parse(bucketUrl)
	b := &cos.BaseURL{BucketURL: u}
	c := cos.NewClient(b, &http.Client{
		//设置超时时间
		Timeout: 30 * time.Second,
		Transport: &cos.AuthorizationTransport{
			SecretID:  config.Config.TencentSecretId,
			SecretKey: config.Config.TencentSecretKey,
		},
	})

	_, err := c.Object.PutFromFile(context.Background(), toPath, filePath, nil)
	if err != nil {
		log.Println(err)
	}
}

func DeleteFile(bucketUrl string, path string) {
	u, _ := url.Parse(bucketUrl)
	b := &cos.BaseURL{BucketURL: u}
	c := cos.NewClient(b, &http.Client{
		//设置超时时间
		Timeout: 30 * time.Second,
		Transport: &cos.AuthorizationTransport{
			SecretID:  config.Config.TencentSecretId,
			SecretKey: config.Config.TencentSecretKey,
		},
	})

	_, err := c.Object.Delete(context.Background(), path, nil)
	if err != nil {
		log.Println(err)
	}
}
