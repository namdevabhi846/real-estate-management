import { Enquiry } from "../../models/enquiry.js";

export const getEnquiry = async function (req, res) {
  const { id } = req.params;
  try {
    const enquiry = await Enquiry.findOne({ enquiry_id: id });
    if (!enquiry) {
      return res.status(404).send({ message: "Can't find Enquiry." });
    }
    return res.status(200).send({ data: enquiry });
  } catch (error) {
    return res.status(400).send(error);
  }
};
