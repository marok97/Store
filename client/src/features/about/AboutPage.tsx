import {
  Alert,
  AlertTitle,
  Button,
  ButtonGroup,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import agent from "../../app/api/agent";
import { useState } from "react";
import { error } from "console";

export default function AboutPage() {
  const [validationError, setValidatonError] = useState<string[]>([]);

  function getValidationError() {
    agent.ErrorTesting.validationError()
      .then((data) => console.log(data))
      .catch((error) => setValidatonError(error));
  }
  return (
    <>
      <Container>
        <Typography variant="h2" gutterBottom>
          Errors for testing..
        </Typography>
        <ButtonGroup fullWidth>
          <Button
            variant="contained"
            onClick={() =>
              agent.ErrorTesting.notFound().catch((error) => console.log(error))
            }
          >
            Not Found Error...
          </Button>
          <Button
            variant="contained"
            onClick={() =>
              agent.ErrorTesting.badRequest().catch((error) =>
                console.log(error)
              )
            }
          >
            Bad Request Error...
          </Button>
          <Button
            variant="contained"
            onClick={() =>
              agent.ErrorTesting.unauthorized().catch((error) =>
                console.log(error)
              )
            }
          >
            Unauthorized...
          </Button>
          <Button variant="contained" onClick={getValidationError}>
            Validation Error...
          </Button>
          <Button
            variant="contained"
            onClick={() =>
              agent.ErrorTesting.serverError().catch((error) =>
                console.log(error)
              )
            }
          >
            Server Error...
          </Button>
        </ButtonGroup>
        {validationError.length > 0 && (
          <Alert severity="error">
            {" "}
            <AlertTitle>Validation Error</AlertTitle>
            <List>
              {validationError.map((error) => (
                <ListItem key={error}>
                  <ListItemText>{error}</ListItemText>
                </ListItem>
              ))}
            </List>
          </Alert>
        )}
      </Container>
    </>
  );
}
