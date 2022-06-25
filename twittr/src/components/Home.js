import React, { useState, useRef } from "react";
import {
  createStyles,
  Text,
  Select,
  Card,
  Divider,
  Box,
  Button,
  Badge,
  Space,
  Group,
  Skeleton,
} from "@mantine/core";
import { Icon } from "@iconify/react";
import { api } from "../helpers/api";
import { FooterCentered } from "./Footer";

const useStyles = createStyles((theme) => ({
  boxPosition: {
    "@media (max-width: 800px)": {
      color: "#1E6386",
      fontFamily: "BR-Firma-Medium",
      fontSize: "60px",
      width: "503px",
      marginLeft: "25px",
      height: "97px",
      lineHeight: "50px",
      marginTop: "70px",
    },
  },
  boxP: {
    "@media (min-width: 800px)": {
      color: "#1E6386",
      fontFamily: "BR-Firma-Medium",
      fontSize: "90px",
      width: "730px",
      marginLeft: "294px",
      height: "222px",
      lineHeight: "100px",
      marginTop: "20px",
    },
  },
  loremDesk: {
    "@media (min-width: 800px)": {
      color: "#1E6386",
      fontFamily: "BR-Firma-Elight",
      fontSize: "35px",
      width: "858px",
      marginLeft: "294px",
      height: "222px",
      lineHeight: "45px",
    },
  },
  loremMobile: {
    "@media (max-width: 800px)": {
      color: "#1E6386",
      fontFamily: "BR-Firma-Elight",
      fontSize: "15px",
      width: "358px",
      marginLeft: "25px",
      height: "59px",
      lineHeight: "18px",
      marginTop: "10px",
      top: "10px",
      position: "relative",
    },
  },
  iconDesk: {
    "@media (min-width: 800px)": {
      top: "10px",
      position: "relative",
    },
  },
  iconMobile: {
    "@media (max-width: 800px)": {
      top: "10px",
      position: "relative",
      height: "50px",
      width: "50px",
    },
  },
  selectMobile: {
    "@media (max-width: 800px)": {
      width: "523px",
      marginLeft: "25px",
      marginTop: "10px",
    },
  },
  selectDesk: {
    "@media (min-width: 800px)": {
      width: "568px",
      marginLeft: "294px",
      marginTop: "-100px",
    },
  },
  cardDesk: {
    "@media (min-width: 800px)": {
      width: "880px",
      height: "224px",
      marginLeft: "294px",
    },
  },
  cardMobile: {
    "@media (max-width: 800px)": {
      width: "459px",
      marginLeft: "17px",
      marginRight: "1px",
      marginTop: "40px",
    },
  },
  buttonMobile: {
    "@media (max-width: 800px)": {
 
      marginLeft: "213px",
      marginRight: "1px",

    },
  },
  buttonDesk: {
    "@media (min-width: 800px)": {
      width: "400px",
      marginLeft: "6px",
      marginRight: "1px",
      marginTop: "40px",
    },
  },
}));
const Home = () => {
  const { classes, cx } = useStyles();
  const [joblist, setJoblist] = React.useState("");
  const [jobs, setJobs] = React.useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const selectForm = useRef(null);
  function handleSubmit(e) {
    if (e.keyCode === 13) {
      e.preventDefault() && selectForm.current.submit();
    } else {
      return;
    }

    console.log(jobs);
    setLoading(true);
    const uu = {
      jobs: joblist,
    };
    console.log(uu);
    console.log(api.jobs);
    fetch(api.jobs, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(uu),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
        setLoading(false);
        setJoblist(data.data);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setError(err.message || err);
      });
  }

  return (
    <div>
      <Text className={cx(classes.boxPosition, classes.boxP)}>
        Developer Jobs on Twitter{" "}
        <Icon
          icon="ant-design:twitter-outlined"
          color="#1E6386"
          height={74}
          width={80}
          className={cx(classes.iconMobile, classes.iconDesk)}
        />
      </Text>
      <Text className={cx(classes.loremMobile, classes.loremDesk)}>
          Easier access to Developer Jobs on Twitter for everyone.
      </Text>
      <form ref={selectForm}>
        <Select
          style={{ width: "80%" }}
          label="Your favorite framework/library"
          placeholder="Pick one and Press Enter"
          searchable
          nothingFound="No options"
          dropdownPosition="bottom"
          value={joblist}
          onChange={setJoblist}
          onKeyDown={handleSubmit}
          data={[
            { value: "Python Hiring", label: "Python" },
            { value: "react hiring", label: "React" },
            { value: "Angular developer", label: "Angular" },
            { value: "Svelte Hiring", label: "Svelte" },
            { value: "Vue Hiring", label: "Vue" },
            { value: "Node js Hiring", label: "Node" },
            { value: "Golang Hiring", label: "Golang" },
            { value: "Haskell Hiring", label: "Haskell" },
            { value: "Django Hiring", label: "Django" },
            { value: "PHP Hiring", label: "PHP" },

          ]}
          className={cx(classes.selectMobile, classes.selectDesk)}

        />
      </form>

      <br />
      <Divider
        my="sm"
        variant="dashed"
        labelPosition="center"
        label={
          <>
            <Icon
              icon="akar-icons:search"
              color="#918e9b"
              height="20"
              rotate={2}
              hFlip={true}
              vFlip={true}
            />

            <Box ml={5} style={{fontSize:18}}>Search results</Box>
          </>
        }
      />
          
      {loading && (
     <div style={{ marginTop: 20 }}>
     <Card
    
    shadow="sm"
    p="xl"
    className={cx(classes.cardDesk, classes.cardMobile)}
  >
       <Card.Section>
         <Text
           weight={500}
           size="lg"
           color="#1E6386"
           style={{
             fontFamily: "BR-Firma-Medium",
             width: "130%",
             pgosition: "relative",
             left: "20px",
             top: "20px",
           }}
         >
           <Skeleton height={60} mt={6} width="70%" radius="20" />
         </Text>
       </Card.Section>
       <Space h="lg" />
       <Space h="lg" />
       <Group spacing="sm" noWrap>
         <div style={{ width: 200 }}>
         <Skeleton height={28} mt={6} width="40%" radius="20" />
         </div>
         <Skeleton height={30} mt={6} width="50%" radius="xl" />
       </Group>
       <div style={{ width: "648px", height: "0px" }}></div>
       <Divider my="sm" labelPosition="center" />
     </Card>
   </div>
      )}
      {joblist.joblist?.map((jobtweet) => (
        <div style={{ marginTop: 20 }}>
          <Card
            key={jobtweet.id}
            shadow="sm"
            p="xl"
            className={cx(classes.cardDesk, classes.cardMobile)}
          >
            <Card.Section>
              <Text
                weight={500}
                size="lg"
                color="#1E6386"
                style={{
                  fontFamily: "BR-Firma-Medium",
                  width: "95%",
                  position: "relative",
                  left: "20px",
                  top: "20px",
                }}
              >
                {jobtweet.tweets}
              </Text>
            </Card.Section>
            <Space h="lg" />
            <Space h="lg" />
            <Group spacing="0" noWrap>
              <div style={{ width: 200 }}>
                <Badge
                  variant="gradient"
                  gradient={{ from: "teal", to: "lime", deg: 105 }}
                >
                  {jobtweet.date}
                </Badge>
              </div>
              <Button
                component="a"
                target="_blank"
                rel="noopener noreferrer"
                href={jobtweet.urls}
                rightIcon={
                  <Icon
                    icon="akar-icons:arrow-right"
                    color="white"
                    height="18"
                    rotate={2}
                    hFlip={true}
                    vFlip={true}
                  />
                }
                styles={(theme) => ({
                  root: {
                    backgroundColor: "#1E6386",
                    border: 0,
                    height: 30,

                    paddingLeft: 20,
                    paddingRight: 20,
                    marginLeft: 500,

                    "&:hover": {
                      backgroundColor: theme.fn.lighten("#1E6386", 0.05),
                    },
                  },

                  leftIcon: {
                    marginRight: 15,
                  },
                })}
                className={cx(classes.buttonMobile)}>
                Apply
              </Button>
            </Group>
            <div style={{ width: "648px", height: "0px" }}></div>
            <Divider my="sm" labelPosition="center" />
          </Card>
        </div>
      ))}
      <Space h="md" />
      <FooterCentered />
    </div>
  );
};

export default Home;
