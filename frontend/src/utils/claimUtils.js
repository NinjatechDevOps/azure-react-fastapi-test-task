export function compareIssuingPolicy(idTokenClaims, policyToCompare) {
  let tfpMatches =
    idTokenClaims.hasOwnProperty("tfp") &&
    idTokenClaims["tfp"].toLowerCase() === policyToCompare.toLowerCase();

  let acrMatches =
    idTokenClaims.hasOwnProperty("acr") &&
    idTokenClaims["acr"].toLowerCase() === policyToCompare.toLowerCase();
  return tfpMatches || acrMatches;
}
