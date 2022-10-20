import joi from "joi";

export const addblog = {
  body: joi
    .object()
    .required()
    .keys({
      title: joi.string().required().max(35),
      description: joi.string().required(),
    }),
};
export const updateblog = {
  params: joi
    .object()
    .required()
    .keys({
      id: joi.string().required().max(24).min(24),
    }),
  body: joi
    .object()
    .required()
    .keys({
      title: joi.string().max(35),
      description: joi.string(),
    }),
};
export const blogId = {
  params: joi
    .object()
    .required()
    .keys({
      id: joi.string().required().max(24).min(24),
    }),
};
