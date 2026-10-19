---
title: "Week 10 — Feature flags"
order: 10
duration: "~8h"
domain: "Feature delivery"
officialResources:
  - title: "Feature management in .NET"
    description: "Flag concepts, filters and feature configuration."
    url: "https://learn.microsoft.com/en-us/azure/azure-app-configuration/feature-management-overview"
  - title: "Microsoft.FeatureManagement library for .NET"
    description: "Registering and evaluating flags in a .NET application."
    url: "https://learn.microsoft.com/en-us/azure/azure-app-configuration/feature-management-dotnet-reference"
exercises:
  - "Create a new simulated payment rule and guard it with a flag evaluated by Microsoft.FeatureManagement"
  - "Configure the flag locally and demonstrate both behaviors in the same payment flow without changing the HTTP contract"
  - "Record which rule was applied and write a test for each flag state"
---

Use the flag to release the rule gradually and practice rolling it back. Document the default value and a criterion for removing the flag once the rule is stable.
