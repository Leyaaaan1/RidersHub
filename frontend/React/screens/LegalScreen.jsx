import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import layout from '../styles/base/layout';
import colors from '../styles/tokens/colors';
import spacing from '../styles/tokens/spacing';
import {fontSize} from '../styles/tokens/typography';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const PRIVACY_POLICY = `Privacy Policy

Last updated: May 17, 2026

This Privacy Policy describes our policies on the collection, use, and disclosure of your information when you use the laagan app, and explains your privacy rights.

Interpretation and Definitions

Account — A unique account created for you to access the Service.

Company — Refers to laagan.

Country — Philippines.

Device — Any device that can access the Service (phone, tablet, computer).

Personal Data — Any information that relates to an identified or identifiable individual.

Service — Refers to the laagan application.

Data We Collect

Personal Data

When using our Service, we may ask you to provide:

- Email address
- Username (derived from your email address)
- Account credentials if you sign in via Facebook (basic profile information such as name and email address provided by Facebook)
- Location data (see below)
- Usage Data (automatically collected)

Usage Data includes your device's IP address, browser type, pages visited, time and date of visits, time spent on pages, and unique device identifiers.

Location

We collect your precise location only while the app is open and active in the foreground — to match you with nearby riders and routes. Location tracking stops completely when the app is minimized or closed.

Your most recent location is saved to our database and is overwritten each time your location updates while the app is active. If you are in an active ride, your saved location stays fixed at the last point recorded and will not change again until your ride ends or you reopen the app.

Sharing during rides: while you are part of an active ride, your location is shared with the other rider(s) or driver(s) in that same ride so they can find and coordinate with you. Your location is not shared with anyone outside of your active ride.

Camera

Camera access is used to scan QR codes and to capture photos during rides (for example, ride or safety documentation). Photos captured through the app are stored only on your own device — they are not uploaded to, or saved on, our servers.

How We Use Your Data

- To provide and maintain the Service
- To manage your account
- To create your username and let you sign in via email or Facebook
- To send a verification message to your email when you register, to confirm you own the email address
- To match you with nearby riders and share your location with other members of your active ride
- To contact you with updates or important communications
- To send news, offers, and general information (with your consent)
- To manage your requests

Sharing Your Data

We do not sell your personal data. We share data only in these limited circumstances:

- With other riders/drivers: your location and username are visible to other members of your active ride, so they can identify and meet you.
- With service providers: we may share data with trusted third parties who help us operate the Service (e.g. cloud hosting, Facebook for login authentication), bound by confidentiality obligations.
- For legal reasons: if required to comply with a legal obligation or to protect the rights, safety, or property of laagan, our users, or the public.

Data Retention

- Account information: Retained for the duration of your account, plus up to 24 months after closure.
- Usage Data: Up to 24 months for service improvement.
- Server logs: Up to 24 months for security monitoring.

Deleting Your Data

You have the right to delete your Personal Data at any time. Sign in to your account, go to account settings, and you can update, amend, or delete your information. You may also contact us directly.

Security

We use commercially reasonable means to protect your data. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.

Children's Privacy

laagan is not directed at anyone under 18. We do not knowingly collect data from minors. If you believe a child has provided us their information, please contact us immediately so we can remove it.

Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy in the app.

Contact Us

Questions about this Privacy Policy? Reach us at:
paninsorolean@gmail.com`;

const TERMS_OF_SERVICE = `Terms of Service

Last updated: May 17, 2026

These Terms of Service govern your use of the laagan app — a ride-sharing platform for solo and group riders in the Philippines. By using laagan, you agree to these terms.

1. Acceptance of Terms

By downloading, installing, or using laagan, you confirm that you are at least 18 years old, have read and understood these Terms, and agree to be bound by them. If you do not agree, please do not use the Service.

2. The Service

laagan is a ride-sharing platform that connects solo and group riders for shared commutes and trips within the Philippines. We provide the platform; riders and drivers coordinate through it.

laagan facilitates connections between users. We are not a transportation provider and are not responsible for the acts or omissions of any rider or driver on the platform.

3. Your Account

- You must provide accurate and complete information when registering.
- You are responsible for maintaining the confidentiality of your login credentials.
- You are responsible for all activity that occurs under your account.
- Notify us immediately at paninsorolean@gmail.com if you suspect unauthorized access.

4. Acceptable Use

You agree not to:

- Use the Service for any unlawful purpose or in violation of Philippine law.
- Impersonate any person, company, or entity.
- Harass, threaten, or harm other users.
- Attempt to gain unauthorized access to any part of the platform.
- Use the app to organize rides for illegal activities.
- Post false, misleading, or fraudulent ride listings.
- Interfere with the proper functioning of the Service.

5. Ride Safety and User Responsibility

You are responsible for your conduct during any ride arranged through laagan. All users must:

- Treat fellow riders and drivers with respect.
- Comply with all applicable traffic and road safety laws.
- Ensure any vehicle used meets legal roadworthiness requirements.
- Not use the app while driving.

6. Intellectual Property

You are free to use, copy, modify, and build upon the laagan app's software and code. The only thing we ask is that you do not use the laagan name or logo to represent your own product or service without our permission, as these identify our brand.

7. Disclaimer of Warranties

The Service is provided on an "as is" and "as available" basis without warranties of any kind, express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or free of harmful components.

8. Limitation of Liability

To the fullest extent permitted by Philippine law, laagan shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of the Service, including but not limited to personal injury, property damage, or losses arising from any ride arranged through the platform.

9. Termination

We reserve the right to suspend or terminate your account at any time, without notice, for conduct that we reasonably believe violates these Terms or is harmful to other users, the Company, or third parties.

10. Governing Law

These Terms are governed by the laws of the Republic of the Philippines. Any disputes arising from these Terms shall be resolved in the competent courts of the Philippines.

11. Changes to These Terms

We may update these Terms from time to time. Continued use of the Service after changes are posted constitutes your acceptance of the revised Terms. We will notify you of significant changes in the app.

12. Contact Us

Questions about these Terms? Contact us at:
paninsorolean@gmail.com`;

export default function LegalScreen({navigation, route}) {
  // Allow deep-linking to a specific tab via route.params.tab
  const initialTab =
    route?.params?.tab === 'terms'
      ? 'terms'
      : route?.params?.tab === 'delete-account'
      ? 'delete-account'
      : 'privacy';
  const [activeTab, setActiveTab] = useState(initialTab);
  const insets = useSafeAreaInsets();

  const TABS = [
    {key: 'privacy', label: 'Privacy Policy'},
    {key: 'terms', label: 'Terms of Service'},
    {key: 'delete-account', label: 'Delete Account'},
  ];

  return (
    <View style={layout.screen}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          paddingTop: insets.top + spacing.md,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="chevron-left" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            color: colors.white,
            fontSize: 18,
            fontWeight: '600',
          }}>
          Legal
        </Text>
        <View style={{width: 20}} />
      </View>

      {/* Tab Switcher */}
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: spacing.md,
          marginTop: spacing.md,
          borderRadius: 8,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.border,
        }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                paddingVertical: spacing.sm,
                alignItems: 'center',
                backgroundColor: isActive ? colors.primary : 'transparent',
              }}>
              <Text
                style={{
                  color: isActive ? colors.white : colors.primary,
                  fontWeight: '600',
                  fontSize: fontSize.body,
                  textAlign: 'center',
                }}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      {activeTab === 'delete-account' ? (
        <ScrollView
          key={activeTab}
          style={{flex: 1}}
          contentContainerStyle={{
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.lg,
          }}>
          <Text
            style={{
              color: colors.white,
              fontSize: fontSize.body,
              lineHeight: 24,
              marginBottom: spacing.md,
            }}>
            You can permanently delete your laagan account and all associated
            data at any time — directly inside the app. This applies to all
            account types: email, Google, and Facebook.
          </Text>

          {/* Step 1 */}
          <View style={{flexDirection: 'row', marginBottom: spacing.md}}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing.sm,
              }}>
              <Text style={{color: colors.white, fontWeight: '700'}}>1</Text>
            </View>
            <Text
              style={{
                flex: 1,
                color: colors.white,
                fontSize: fontSize.body,
                lineHeight: 22,
              }}>
              Tap your profile icon in the top-left corner of the home screen
            </Text>
          </View>

          {/* Step 2 */}
          <View style={{flexDirection: 'row', marginBottom: spacing.lg}}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing.sm,
              }}>
              <Text style={{color: colors.white, fontWeight: '700'}}>2</Text>
            </View>
            <Text
              style={{
                flex: 1,
                color: colors.white,
                fontSize: fontSize.body,
                lineHeight: 22,
              }}>
              Scroll down to the Account section and tap Delete Account, then
              confirm
            </Text>
          </View>

          <View
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              padding: spacing.md,
              marginBottom: spacing.md,
            }}>
            <Text
              style={{
                color: colors.textMuted ?? colors.white,
                fontSize: fontSize.small ?? fontSize.body,
                lineHeight: 20,
                textAlign: 'center',
              }}>
              All your data — rides, profile, and location history — will be
              permanently removed within 30 days. This action cannot be undone.
            </Text>
          </View>

          <Text
            style={{
              color: colors.textMuted ?? colors.white,
              fontSize: fontSize.small ?? fontSize.body,
              textAlign: 'center',
            }}>
            Need help? Contact us at paninsorolean@gmail.com
          </Text>
        </ScrollView>
      ) : (
        <ScrollView
          key={activeTab}
          style={{flex: 1}}
          contentContainerStyle={{
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
          }}>
          <Text
            style={{
              color: colors.white,
              fontSize: fontSize.body,
              lineHeight: 24,
            }}>
            {activeTab === 'privacy' ? PRIVACY_POLICY : TERMS_OF_SERVICE}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}
