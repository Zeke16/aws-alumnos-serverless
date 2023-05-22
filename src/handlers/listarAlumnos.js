import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "us-west-2" })
);

const listarAlumnos = async (event, context) => {
  try {
    const alumnos = await dynamo.send(
      new ScanCommand({
        TableName: "alumnos",
      })
    );

    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(alumnos.Items),
    };
    return response;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
};

export const handler = commonMiddleware(listarAlumnos);
