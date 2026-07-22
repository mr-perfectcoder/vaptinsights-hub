```md
# VAPT Insights - DPDP Readiness Scanner (MVP Specification)

> Version: 1.0
> Product: VAPT Insights
> Module: Compliance Hub
> URL: /compliance/dpdp
> Authentication: Not Required
> Purpose: Technical DPDP Readiness Assessment (Not Legal Certification)

---

# Overview

The DPDP Readiness Scanner helps organizations quickly evaluate whether their public-facing website appears to follow important privacy and data protection practices aligned with India's Digital Personal Data Protection (DPDP) Act.

The scanner is intended to provide a technical readiness report, identify missing privacy controls, and recommend improvements.

**This scanner is NOT a legal compliance certification.**

---

# User Flow

User enters

https://example.com

↓

Scanner performs automated analysis

↓

Collects publicly available information

↓

Generates DPDP Readiness Report

↓

Displays Findings, Score, Recommendations

↓

User downloads PDF (Future)

---

# Scanner Modules

---

# 1. Website Information

Collect

- Website Title
- Domain
- Redirects
- Final URL
- HTTPS Enabled
- HTTP Version
- Server
- Hosting Provider (Future)
- CDN
- Country (Future)

Display

Website
example.com

HTTPS
Enabled

Server
Cloudflare

HTTP Version
HTTP/2

---

# 2. HTTPS Security

Reuse existing VAPT Scanner

Checks

- HTTPS Enabled
- HSTS
- Valid SSL
- Certificate Expiry
- Weak TLS
- Mixed Content

---

# 3. Security Headers

Reuse Existing Scanner

Check

- CSP
- HSTS
- X-Frame-Options
- Referrer Policy
- Permissions Policy
- X-Content-Type-Options

---

# 4. Privacy Policy Detection

Automatically search for

/privacy

/privacy-policy

/legal/privacy

/policy/privacy

/privacy.html

Also detect links containing

Privacy

Privacy Policy

Data Protection

Collect

Privacy Policy Exists

Last Updated Date

Policy Length

Language

Contact Email

Contact Address

Grievance Officer

DPO

Retention Period

Purpose of Collection

Third Party Sharing

Cross Border Transfers

Children's Privacy

User Rights

---

# Privacy Policy Score

Example

Privacy Policy

Status
Found

Last Updated
12 Jan 2026

Contact
Yes

Retention Policy
No

User Rights
Yes

Score
8/10

---

# 5. Cookie Compliance

Detect

Cookie Banner

Cookie Categories

Consent Before Tracking

Accept Button

Reject Button

Manage Preferences

Cookie Storage

Consent Cookie

Scan Cookies

Essential

Analytics

Marketing

Functional

Unknown

Check Cookie Flags

Secure

HttpOnly

SameSite

Score

---

# Cookie Findings

Cookie Banner

YES

Reject Button

NO

Consent Stored

YES

Analytics Loaded Before Consent

YES

Severity

High

---

# 6. Third Party Trackers

Detect

Google Analytics

Google Tag Manager

Google Ads

Meta Pixel

LinkedIn Insight

Microsoft Clarity

Hotjar

HubSpot

Intercom

Mixpanel

Segment

Stripe

Razorpay

PayU

Display

Tracker

Purpose

Potential Personal Data Collection

---

# 7. Consent Management

Check

Consent Banner

Consent Mode

Granular Consent

Reject Option

Preferences

Withdraw Consent

Consent Logging (Future)

---

# 8. Forms Scanner

Automatically discover

Contact Forms

Newsletter

Login

Register

Support

Feedback

Job Application

Lead Forms

Check

Privacy Policy Link

Consent Checkbox

Mandatory Consent

Marketing Consent

File Upload

Sensitive Information

---

# Form Example

Contact Form

Privacy Link
YES

Consent Checkbox
NO

Marketing Checkbox
NO

Severity
Medium

---

# 9. Legal Pages

Search

/privacy

/privacy-policy

/terms

/terms-and-conditions

/cookie-policy

/refund-policy

/contact

/about

/grievance

/data-protection

Display

Found

Missing

Broken

---

# 10. User Rights Detection

Search keywords

Access Data

Delete Data

Correct Data

Update Data

Withdraw Consent

Nominate

Data Principal

Erase

Rectify

Data Portability

Score

---

# 11. Grievance Officer

Detect

Grievance Officer

Data Protection Officer

Privacy Officer

Compliance Officer

Collect

Name

Email

Phone

Address

---

# 12. Children's Privacy

Detect keywords

Minor

Under 18

Under 13

Parent

Guardian

Parental Consent

Age Verification

---

# 13. Data Retention

Search

Retention

Delete

Erase

Archive

Storage Period

Retention Period

Automatic Deletion

---

# 14. Cross Border Transfer

Search

AWS

Azure

Google Cloud

Singapore

United States

European Union

Cloudflare

CDN

Display

Possible International Data Transfer

Not Detected

---

# 15. Contact Information

Detect

Email

Phone

Address

Support Portal

Contact Form

---

# 16. Accessibility

Check

Privacy Page Reachable

Cookie Banner Keyboard Accessible

Consent Buttons Visible

---

# 17. Robots

Check

robots.txt

sitemap.xml

---

# 18. Public Files

Check

ads.txt

security.txt

humans.txt

---

# 19. Overall Readiness Score

100 Point Scale

Privacy Policy

15

Cookies

20

Consent

15

Forms

10

User Rights

10

Security Headers

10

HTTPS

10

Legal Pages

5

Grievance Officer

5

Children Privacy

5

Third Party Tracking

5

Total

100

---

# Risk Levels

Critical

Red

High

Orange

Medium

Yellow

Low

Blue

Info

Gray

---

# Example Result

DPDP Readiness

82 / 100

Grade

A-

---

Critical

No Cookie Banner

High

Analytics Loaded Before Consent

High

No Grievance Officer

Medium

No Retention Policy

Low

Privacy Policy Last Updated 3 Years Ago

---

# Recommendations

Add Cookie Consent Banner

Implement Reject All Option

Publish Cookie Policy

Appoint Grievance Officer

Add Data Retention Policy

Provide Consent Withdrawal

Review Third Party Tracking

Update Privacy Policy

Add Children's Privacy Section

---

# Download Report

Future

PDF

JSON

Share Link

Executive Summary

---

# Future Features

AI Privacy Policy Review

Privacy Policy Generator

Cookie Scanner Browser Extension

Consent Simulator

DPDP Checklist

Compliance History

Scheduled Monitoring

Weekly Reports

Email Alerts

Compliance Monitoring

Public Compliance Badge

---

# Disclaimer

This scanner provides a technical readiness assessment based on publicly accessible website information.

It does not certify legal compliance with the Digital Personal Data Protection Act (DPDP), GDPR, ISO 27001, or any other regulation.

Organizations should consult qualified legal and compliance professionals before making regulatory decisions.

---

# Tech Reuse from Existing VAPT Insights

Reuse Existing Modules

✓ SSL Scanner

✓ Security Headers Scanner

✓ Technology Detection

✓ HTTP Scanner

✓ Cookie Detection

✓ Form Detection

✓ Link Crawler

✓ HTML Parser

✓ Sitemap Scanner

✓ robots.txt Scanner

This minimizes development effort while adding significant value through DPDP-specific analysis and reporting.
```

I would position this as **"DPDP Readiness Scanner"** rather than **"DPDP Compliance Scanner"**. "Readiness" accurately reflects that you're assessing publicly visible technical indicators without claiming legal certification, which is both safer and more credible for VAPT Insights.


                 VAPT Insights × DPDP
          Technical Readiness Center Workflow


┌───────────────────────────────┐
│ User Enters Website URL        │
│ https://example.com            │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Backend Validation             │
│                                │
│ ✓ URL Format                  │
│ ✓ Domain Reachable             │
│ ✓ HTTPS Enabled                │
│ ✓ Website Accessible           │
└───────────────┬───────────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
 Invalid URL        Valid Website
 Show Error              │
                        ▼
┌───────────────────────────────┐
│ Organization Profile           │
│                                │
│ Select Industry                │
│                                │
│ • SaaS                         │
│ • E-commerce                   │
│ • Finance                      │
│ • Healthcare                   │
│ • Education                    │
│ • Government                   │
│ • Manufacturing                │
│ • Other                        │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Website Discovery Engine       │
│                                │
│ Crawl Website                  │
│                                │
│ Detect:                        │
│                                │
│ ✓ Privacy Policy               │
│ ✓ Terms & Conditions            │
│ ✓ Cookie Policy                │
│ ✓ Trust & Security Center      │
│ ✓ Contact Page                 │
│ ✓ Data Request Page            │
│ ✓ Cookie Preference Center     │
│ ✓ Login Page                   │
│ ✓ Signup Page                  │
│ ✓ Forgot Password Page         │
│ ✓ Account/Profile Page         │
│ ✓ Checkout Page                │
│ ✓ Payment Page                 │
│ ✓ Newsletter Page              │
│ ✓ Contact Forms                │
│ ✓ Career Page                  │
│ ✓ Support Portal               │
│ ✓ API Documentation            │
│ ✓ Developer Portal             │
│ ✓ Status Page                  │
│ ✓ Subdomains                   │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Compliance Asset Review        │
│                                │
│ User Reviews Detected URLs     │
│                                │
│ Edit / Add Missing Links       │
│                                │
│ Required:                      │
│ ✓ Privacy Policy               │
│ ✓ Terms & Conditions            │
│                                │
│ Optional:                      │
│ ✓ Cookie Policy                │
│ ✓ Trust Center                 │
│ ✓ Other Assets                 │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Assessment Configuration       │
│                                │
│ Select Scan Modules            │
│                                │
│ ✓ Privacy Notice Analysis      │
│ ✓ Cookie Consent Scan          │
│ ✓ Consent Management           │
│ ✓ Personal Data Discovery      │
│ ✓ Form Analysis                │
│ ✓ Third Party Tracker Scan     │
│ ✓ Data Collection Analysis     │
│ ✓ Security Disclosure Check    │
│ ✓ Grievance Mechanism Check    │
│ ✓ DPDP Rights Check            │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ DPDP Assessment Engine         │
│                                │
│ Website Crawler                │
│        │                       │
│        ▼                       │
│ Evidence Collector             │
│                                │
│ HTML                            │
│ DOM                             │
│ Cookies                         │
│ Network Requests                │
│ Screenshots                     │
│ Headers                         │
│ Documents                       │
│                                │
│        ▼                       │
│ DPDP Rule Engine                │
│                                │
│ Notice Rules                    │
│ Consent Rules                   │
│ Cookie Rules                    │
│ Rights Rules                    │
│ Security Rules                  │
│ Grievance Rules                 │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Compliance Scoring Engine      │
│                                │
│ Calculate:                     │
│                                │
│ ✓ Compliance Score             │
│ ✓ Risk Level                   │
│ ✓ Critical Findings             │
│ ✓ Missing Requirements          │
│ ✓ Evidence                     │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ DPDP Compliance Report         │
│                                │
│ Executive Summary              │
│ Compliance Score               │
│ Failed Controls                │
│ Evidence                       │
│ Risk Explanation               │
│ Remediation Steps              │
│ Priority Roadmap               │
│ PDF Export                     │
└───────────────────────────────┘
