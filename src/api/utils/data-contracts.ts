/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface FeedDTO {
  title: String;
  description: String;
  author: String;
  journal: String;
  link: String;
}

export interface ApiResponse {
  status?: string;
  description?: string;
  data?: FeedDTO[];
}

export interface ApiError {
  status?: string;
  description?: string;
}

export interface LegacyResponse {
  status?: number;
  description?: string;
  data: any;
}
