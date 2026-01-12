import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title,
    description,
    keywords,
    name = "AH Muzahid",
    type = "website",
    image = "https://loan-link-two.vercel.app/Banner.png", // Live Banner Link
    url = "https://loan-link-two.vercel.app/"
}) => {
    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title} | LoanLinks - AH Muzahid</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={name} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content="LoanLinks" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content="@AH-Muzahid" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

SEO.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    keywords: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    image: PropTypes.string,
    url: PropTypes.string
};

export default SEO;
