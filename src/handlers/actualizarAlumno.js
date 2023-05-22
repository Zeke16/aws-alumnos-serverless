import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "us-west-2" })
);

const actualizarAlumno = async (event, context) => {
  let alumnoExiste;
  const id = event.pathParameters.id;
  const alumnoActualizar = event.body;
  const newAlumnoActualizar = {
    ...alumnoActualizar,
    id_alumno: id,
  };

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

    alumnoExiste = result.Item;

    if (!alumnoExiste) {
      throw new createError.NotFound(`Alumno con id ${id} no encontrado`);
    }

    await dynamo.send(
      new PutCommand({
        TableName: "alumnos",
        Item: newAlumnoActualizar,
      })
    );
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  const response = {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
        alumno: alumnoActualizar,
        estado: "Actualizado"
    }),
  };
  return response;
};

export const handler = commonMiddleware(actualizarAlumno);
