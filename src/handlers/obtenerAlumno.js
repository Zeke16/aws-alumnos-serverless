import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "us-west-2" })
);

const obtenerAlumno = async (event, context) => {
  const id = event.pathParameters.id;

  let alumno;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };
  try {
    const result = await dynamo.send(
      new GetCommand({
        TableName: "alumnos",
        Key: { id_alumno: id },
      })
    );

    alumno = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if (!alumno) {
    throw new createError.NotFound(`Alumno con id ${id} no encontrado`);
  }

  const response = {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify(alumno),
  };
  return response;
};

export const handler = commonMiddleware(obtenerAlumno);
