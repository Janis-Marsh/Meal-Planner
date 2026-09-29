# ADR: Validation Approach

**Status:** Accepted

## Context

The Meal Planner API needs to validate incoming data and enforce business rules before records are stored in the database. Some validation rules are simple field-level requirements, such as required fields, valid meal types, and minimum serving amounts. Other rules depend on multiple fields and therefore cannot be handled effectively by basic schema validation alone. For example, a meal plan may contain more than seven meals, but it cannot contain two meals of the same meal type on the same day. The API also needs to prevent finalized meal plans from being modified.

## Decision

Mongoose schema validation will be used for basic field-level validation, while the service layer will handle application-specific business rules. Mongoose will handle required fields, data types, enums, and minimum values. The service layer will handle rules involving multiple fields or the state of a resource. This keeps business logic out of controllers and routes and makes the rules easier to test and maintain.

## Consequences

This approach keeps simple validation close to the data model while keeping business rules in the service layer. It makes the application easier to expand when authentication and authorization are added later. The disadvantage is that validation logic exists in more than one layer, so developers must know which layer is responsible for each rule.

## Alternatives Considered

One alternative was putting all validation in the controllers. This was rejected because it would make controllers responsible for business logic and make them harder to maintain and test.