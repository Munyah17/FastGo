# FastGo — Positioning & Build Separation

**FastGo is a technology company.** It is not a transporter, logistics provider, public transport operator, or passenger liner. It owns no vehicles, no taxis, no fleet. It builds and operates a platform that intermediates, verifies, and safeguards ride-sharing between independent partners (drivers and car owners sharing their ride, at their own terms) and passengers looking for a ride to share.

This document separates what we build into two distinct layers, so every feature lands in the right place with the right framing.

---

## Layer 1 — Technical Commands (the platform)

What the software *does*. These are neutral technology functions — none of them constitute providing transportation:

| Capability | What it is | What it is NOT |
|---|---|---|
| **Matching** | Connects a passenger's request with nearby available partners | Dispatching a fleet we control |
| **Fare offers** | Passenger sees a suggested estimate and can offer a fare; partner accepts, counters, or declines. The *parties* agree the price | FastGo setting or imposing a tariff like a transport operator |
| **Verification** | Identity, licence, vehicle, insurance and document checks on partners; document expiry pauses matching automatically | Employing or certifying drivers as our staff |
| **Safety tooling** | SOS, live trip sharing, PIN verification, trusted contacts, auditable trip records | Assuming carrier liability for the journey |
| **Payments plumbing** | Wallet, top-ups via licensed PSPs (EcoCash, OneMoney, Paynow, cards), cash recording, commission ledgering | Being a payment system or money transmitter ourselves |
| **Records** | Trip, GPS, and compliance event trails (Data Protection Act-aware) | Surveillance; records exist for safety, disputes, and accountability |

## Layer 2 — Supporting Structures (the framing that protects everyone)

The contractual, compliance, and language scaffolding around the technology:

- **Partner Agreement** — partners are independent. They choose when to go online, which requests to accept, and what fare to accept or counter. FastGo charges a platform service fee on completed connections.
- **Passenger Terms** — the transportation contract is between passenger and partner. FastGo provides the introduction, verification, safety tooling and payment facilitation.
- **Product language** — the app says *partner*, *share a ride*, *connect*, *offer a fare*. It never says FastGo "transports", "carries", "dispatches our fleet", or "employs drivers".
- **Compliance engine framing** — per-council rules are configurable data, not an admission that any specific regime applies. Where a partner needs a permit in a jurisdiction, the platform helps them stay valid; where the law is silent, the platform maintains records that demonstrate responsible operation.
- **Driver protection mission** — verification, auditable records, insurance partnerships (Motions), and legal-assistance cover exist so partners facing arbitrary or predatory enforcement have documentation, support, and a defensible position.

## The rule of thumb for every future feature

> If a feature could make FastGo look like it *operates transport* (setting mandatory fares, guaranteeing rides, branding vehicles as "our fleet", scheduling drivers into shifts), redesign it as a marketplace/tooling feature or don't build it.

This is product/business architecture, **not legal advice**. The structure must still be validated with Zimbabwean transport counsel per launch council before the first paid connection.
