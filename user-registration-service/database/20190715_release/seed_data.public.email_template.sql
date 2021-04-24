DELETE FROM public.email_template;

INSERT INTO public.email_template VALUES ('REGISTRATION_COMPLETE', '<p>Congratulations! Your account has been confirmed and is now active.  You may access this new Bill Pay system to review your latest balance and make payments at any time using this link. Please be sure to save this link along with your account credentials for future use.</p>

<#if brand == "national" && userType == "grower">
<p><a href="https://aganytime-np.agro.services/portal">https://aganytime-np.agro.services/portal</a></p>
</#if>

<p>If you have any questions, please contact the FarmFlex Credit Team by calling 1-800-335-2676, option 2.</p>', '[NON-PROD] Bill Pay Registration Complete');
INSERT INTO public.email_template VALUES ('EMAIL_VERIFICATION', '<p>You''re almost there!</p>
<p>Please click <a href="https://aperture-user-registration.velocity-np.ag/verify-email/${userId}/${emailVerificationCode}">here</a> to access the final steps of your Bill Pay registration and activate your account.</br>
If you have any questions, please contact the FarmFlex Credit Team by calling 1-800-335-2676, option 2.</p>
<p>Thank you!</p>', '[NON-PROD] Complete your Bill Pay Registration');
INSERT INTO public.email_template VALUES ('PRE_REGISTRATION_INVITE', '<div style="width: 96%; margin-left: 1%; padding: 1%; border-style: solid; border-width: 3px;">
<img style="width:98%; height: auto; margin-left: 1%; margin-right: 1%;" src="https://velocity-np.ag/self-registration/assets/images/email-header-dad.jpg">

<div style="margin-top: 30px; margin-bottom: 30px;"><hr></div>

<div style=''margin-left: 1%; margin-right: 1%; font-family: "Times New Roman", Times, serif;''>

<p>Valued Customer,</p>

<p>DEKALB®, Asgrow® and Deltapine® brands are excited to offer a new, simple online payment system to FarmFlex® Financing customers. Selecting this <a ses:no-track href="https://velocity-np.ag/self-registration/register/${userId}">link</a> will direct you through the simple registration process!</p>
 
<p>The new site will provide a secure and reliable way to pay online. You will be able to:
<ul>
<li>Set up payment via bank account or debit/credit card, and save that information for future payments.</li>
<li>View up-to-date <strong>balance</strong> information and <strong>make a payment</strong> 24 hours a day, 7 days a week.</li>
</ul>
</p>

<#if resend>
<p style="margin-top: 30px;">
<#else>
<p style="margin-top: 30px; margin-bottom: 60px;">
</#if>

If you have any questions, reach out to the FarmFlex Credit Team at <a ses:no-track href="mailto:Farmflex.Credit@Monsanto.com">Farmflex.Credit@Monsanto.com</a>.</p>

<#if resend>
<p style="margin-bottom: 60px;">*Please disregard this email if you have already paid your account balance.</p>
</#if>

<p style="font-size: 9.0pt;">DEKALB® Asgrow® Deltapine® Brands</p>

<p style="font-size: 9.0pt;">800 N. Lindbergh Blvd. St. Louis, MO  63167</p>

</div></div>

<p style=''font-size: 9.0pt; font-family: "Times New Roman", Times, serif;''>Asgrow and the A Design®, Asgrow®, DEKALB and Design®, DEKALB® and Deltapine® are registered trademarks of Bayer Group. © 2018 Bayer Group. All Rights Reserved.</p>', '[NON-PROD] Check out the NEW Online Payment system for FarmFlex® Financing Customers');
INSERT INTO public.email_template VALUES ('NBD_PRE_REGISTRATION_INVITE', '<div>
    <p>Hello,</p>
    <p>
        Welcome to <strong>MyCROP</strong>,
        the new dealer portal brought to you by Bayer. <strong>MyCROP</strong> will provide you with valuable
        information to help you deliver an enhanced customer experience.
        This is where success in the field meets growth for your business with insights and tools to help maximize
        performance for your customers all season long.
    </p>
    <p>
        Please take a moment and register <strong><a ses:no-track
                                                     href="https://velocity-np.ag/self-registration/register/${userId}">here</a></strong>. Please also
        bookmark
        <em>mycrop.bayer.com</em> to access <strong>MyCROP</strong> in the future.
    </p>
    <p>
        Thank you, <br>
        Bayer
    </p>
</div>

<p>Bayer is a registered trademark of Bayer Group. ©2019 Bayer Group. All rights reserved.</p>', '[NON-PROD] Welcome to MyCROP');
INSERT INTO public.email_template VALUES ('NBD_REGISTRATION_COMPLETE', '<div>
    <p>Hello,</p>

    <p>Thank you for registering your personal <strong>MyCROP</strong> account. <strong>MyCROP</strong> is the new
        dealer portal brought to you by Bayer, this is where success in the field meets
        growth for your business with insights and tools to help maximize performance
        for your customers all season long.</p>

    <p>If you haven’t already done so, please
        bookmark <em><a href="https://mycrop.bayer.com">mycrop.bayer.com</a></em>.</p>
    <p>Thank you, <br>Bayer</p>
</div>

<p>Bayer is a registered trademark of Bayer Group. ©2019 Bayer Group. All rights reserved.</p>', '[NON-PROD] MyCROP - Thank You for Registering');

-- SELECT * FROM public.email_template;