import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "us-west-2" })
);

const crearAlumno = async (event, context) => {
  try {
    const alumno = event.body;

    const newAlumno = {
      ...alumno,
      id_alumno: uuid()
    };

    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(newAlumno),
    };

    await dynamo.send(
      new PutCommand({
        TableName: "alumnos",
        Item: newAlumno,
      })
    );

    return response;
  } catch (error) {
    console.log(error.message);
    throw new createError.InternalServerError(error);
  }
};

export const handler = commonMiddleware(crearAlumno);
