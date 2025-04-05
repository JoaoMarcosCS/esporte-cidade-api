import { Request, Response, RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export type RouteHandler = RequestHandler;

export type RouteHandlerWithParams<T extends { [key: string]: string }> = RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any> & T>;

export type RouteHandlerWithBody<T> = RequestHandler<any, any, T>;
