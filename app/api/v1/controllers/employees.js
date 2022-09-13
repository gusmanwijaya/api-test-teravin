const { Employees } = require("../models");
const CustomError = require("../../../errors");
const { StatusCodes } = require("http-status-codes");
const { Op } = require("sequelize");
const moment = require("moment");

module.exports = {
  get: async (req, res, next) => {
    try {
      const {
        keyword,
        sortByField,
        valueSort,
        page = 1,
        limit = 10,
      } = req.query;

      const parsePage = parseInt(page);
      const parseLimit = parseInt(limit);

      let condition = {};

      if (keyword) {
        condition = {
          where: {
            [Op.or]: [
              {
                id: {
                  [Op.substring]: keyword,
                },
              },
              {
                name: {
                  [Op.substring]: keyword,
                },
              },
              {
                email: {
                  [Op.substring]: keyword,
                },
              },
            ],
          },
        };
      }

      condition = {
        ...condition,
        offset: parseLimit * (parsePage - 1),
        limit: parseLimit,
      };

      if (sortByField) {
        condition = {
          ...condition,
          order: [[sortByField, valueSort]],
        };
      }

      const data = await Employees.findAll(condition);

      const count = await Employees.count(condition);

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Successfully get data",
        currentPage: parsePage,
        totalPage: Math.ceil(count / parseLimit),
        totalData: count,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  detail: async (req, res, next) => {
    try {
      const { id: employeeId } = req.params;

      const data = await Employees.findOne({
        where: {
          id: employeeId,
        },
      });

      if (!data)
        throw new CustomError.NotFound(
          `Employee with id: ${employeeId} not found!`
        );

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Successfully get detail data",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const { name, email, mobile, birthDate, address } = req.body;

      if (!name) throw new CustomError.BadRequest("Name can't be empty!");
      if (!email) throw new CustomError.BadRequest("Email can't be empty!");
      if (!mobile) throw new CustomError.BadRequest("Mobile can't be empty!");
      if (!birthDate)
        throw new CustomError.BadRequest("Birth date can't be empty!");
      if (!address) throw new CustomError.BadRequest("Address can't be empty!");

      const regexEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      const checkFormatEmail = String(email).toLowerCase().match(regexEmail);
      if (!checkFormatEmail)
        throw new CustomError.BadRequest("Please input a valid email!");

      const checkEmailOnDb = await Employees.findOne({
        where: {
          email,
        },
      });
      if (checkEmailOnDb)
        throw new CustomError.BadRequest("Email already registered!");

      const YY = moment().format("YY");
      const MM = moment().format("MM");
      let XXXX;

      const checkIDOnDb = await Employees.findAll();

      if (checkIDOnDb.length > 0) {
        const checkMonth = checkIDOnDb[checkIDOnDb.length - 1].id.substring(
          2,
          4
        );

        if (moment().format("MM") !== checkMonth) {
          XXXX = "0001";
        } else {
          const result =
            parseInt(checkIDOnDb[checkIDOnDb.length - 1].id.substring(4, 8)) +
            1;
          if (result < 10) {
            XXXX = `000${result}`;
          } else if (result >= 10) {
            XXXX = `00${result}`;
          } else if (result >= 100) {
            XXXX = `0${result}`;
          } else if (result >= 1000) {
            XXXX = `${result}`;
          }
        }
      } else {
        XXXX = "0001";
      }

      const data = await Employees.create({
        id: `${YY}${MM}${XXXX}`,
        name,
        email,
        mobile,
        birthDate,
        address: JSON.parse(address).join(", "),
      });

      res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        message: "Successfully created data",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id: employeeId } = req.params;
      const { name, email, mobile, birthDate, address } = req.body;

      if (!name) throw new CustomError.BadRequest("Name can't be empty!");
      if (!email) throw new CustomError.BadRequest("Email can't be empty!");
      if (!mobile) throw new CustomError.BadRequest("Mobile can't be empty!");
      if (!birthDate)
        throw new CustomError.BadRequest("Birth date can't be empty!");
      if (!address) throw new CustomError.BadRequest("Address can't be empty!");

      const regexEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      const checkFormatEmail = String(email).toLowerCase().match(regexEmail);
      if (!checkFormatEmail)
        throw new CustomError.BadRequest("Please input a valid email!");

      const checkEmailOnDb = await Employees.findOne({
        where: {
          id: {
            [Op.ne]: employeeId,
          },
          email,
        },
        attributes: ["email"],
      });
      if (checkEmailOnDb)
        throw new CustomError.BadRequest("Email already registered!");

      let data = await Employees.findOne({
        where: {
          id: employeeId,
        },
      });

      if (!data)
        throw new CustomError.NotFound(
          `Employee with id: ${employeeId} not found!`
        );

      data.name = name;
      data.email = email;
      data.mobile = mobile;
      data.birthDate = birthDate;
      data.address = JSON.parse(address).join(", ");

      await data.save();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Successfully updated data!",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  destroy: async (req, res, next) => {
    try {
      const { id: employeeId } = req.params;

      const data = await Employees.findOne({
        where: {
          id: employeeId,
        },
      });

      if (!data)
        throw new CustomError.NotFound(
          `Employee with id: ${employeeId} not found!`
        );

      await data.destroy();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Successfully deleted data!",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
