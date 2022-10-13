const express = require("express");
const router = express.Router();
const ServiceSubCategory = require("../Models/SubCategory");
const Work = require("../Models/Work");
const ServiceRequest = require("../Models/ServiceRequest");
const Booking = require("../Models/Booking");

router
  .route("/service-sub-category")
  .get(async function (req, res) {
    try {
      let queryResult = await ServiceSubCategory.find({}).exec();
      res.send(queryResult);
    } catch (error) {
      res.send(error);
    }
  })
  .post(function (req, res) {
    const SubCategory = new ServiceSubCategory({
      ServiceID: req.body.ServiceID,
      ServiceSubCategory: req.body.subCategory,
    });
    SubCategory.save(function (err) {
      if (!err) {
        res.send("New Service Sub Category Created");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    ServiceSubCategory.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all files");
      } else {
        res.send(err);
      }
    });
  });

///specific////

router
  .route("/service-sub-category/:id")
  .get(function (req, res) {
    ServiceSubCategory.find({ _id: req.params.id }, function (err, services) {
      if (services) {
        res.send(services);
      } else {
        res.send("No such data found");
      }
    });
  })
  .delete(async function (req, res) {
    console.log("asd");
    const workQuery = await Work.find(
      {
        ServiceSubId: req.params.id,
      },
      {
        __v: 0,
        ServiceSubId: 0,
        workerId: 0,
        minPrice: 0,
        maxPrice: 0,
        deleteflag: 0,
      }
    ).lean();
    const workId = workQuery.map((object) => object._id);

    const serviceRequestQuery = await ServiceRequest.find(
      {
        workId: { $in: workId },
        requestStatus: 1,
      },
      {
        workerId: 0,
        recruiterId: 0,
        workId: 0,
        subCategory: 0,
        minPrice: 0,
        maxPrice: 0,
        serviceDate: 0,
        startTime: 0,
        endTime: 0,
        description: 0,
        requestStatus: 0,
        comment: 0,
        deleteflag: 0,
        created_at: 0,
      }
    ).lean();
    const BookingQuery = await Booking.find(
      {
        workId: { $in: workId },
        bookingStatus: 1,
      },
      {
        workerId: 0,
        recruiterId: 0,
        workId: 0,
        subCategory: 0,
        minPrice: 0,
        maxPrice: 0,
        serviceDate: 0,
        startTime: 0,
        endTime: 0,
        description: 0,
        bookingStatus: 0,
        comment: 0,
        deleteflag: 0,
        created_at: 0,
        geometry: 0,
      }
    ).lean();
    // console.log(serviceRequestQuery);
    if (serviceRequestQuery == 0 && BookingQuery == 0) {
      ServiceSubCategory.findOneAndUpdate(
        { _id: req.params.id },
        {
          deleteflag: 1,
        },
        function (err) {
          if (!err) {
            res.send("Deleted Successfully ");
          } else {
            res.send(err);
          }
        }
      );
    } else {
      res.send("A Request is on going cannot delete");
    }
  });

module.exports = router;
