import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  Container,
  UserPhoto,
  InfoWrapper,
  ActionWrapper,
  UserDummyAvatarWrapper
} from './styles'

import { useSession } from '~components/contexts/SessionContext'
import { SingleProfessionalCard as SingleProfessionalCardController } from '~components/components/SingleProfessionalCard'
import { Modal } from '~ui/src/components/Modal'
import { ProfessionalInfo } from '~ui/src/components/ProfessionalInfo'

import { Icon } from '~ui-icon'

const SingleProfessionalCardUI = (props) => {
  const {
    professional,
    isSkeleton,
    handleFavoriteProfessional,
    isSmallPhoto,
    active,
    handleProfessionalClick
  } = props

  const [{ auth }] = useSession()
  const [open, setOpen] = useState(false)

  const handleChangeFavorite = () => {
    if (auth) {
      handleFavoriteProfessional && handleFavoriteProfessional(!professional?.favorite)
    }
  }

  const handleOpenProfileInfo = () => {
    setOpen(true)
  }

  return (
    <>
      <Container
        active={active}
        isCursor={!!handleProfessionalClick}
        onClick={e => handleProfessionalClick && handleProfessionalClick(e, professional)}
      >
        {isSkeleton
          ? (
          <Skeleton style={{ width: '86px', height: '86px' }} />
            )
          : (
              professional?.photo
                ? <UserPhoto bgimage={professional?.photo} isSmallPhoto={isSmallPhoto} />
                : <UserDummyAvatarWrapper isSmallPhoto={isSmallPhoto}><Icon name="user" /></UserDummyAvatarWrapper>
            )}
        <InfoWrapper>
          <h4>{isSkeleton ? <Skeleton height={18} width={120} /> : <>{professional?.name} {professional?.last_name}</>}</h4>
          {isSkeleton ? <Skeleton height={15} width={80} /> : <>{professional?.occupation?.name && <p>{professional?.occupation?.name}</p>}</>}
          <ActionWrapper isSmallPhoto={isSmallPhoto}>
            {isSkeleton
              ? (
              <>
                <Skeleton width={16} height={16} />
                <Skeleton width={16} height={16} style={{ margin: '0px 7px' }} />
              </>
                )
              : (
              <>
                <Icon name="infoCircle" className='info' onClick={() => handleOpenProfileInfo()} />
                <span onClick={() => handleChangeFavorite()} className='favorite'>
                  {professional?.favorite ? <Icon name="heartFilled" /> : <Icon name="heartOutline" />}
                </span>
              </>
                )}
          </ActionWrapper>
        </InfoWrapper>
      </Container>
      {open && (
        <Modal
          open={open}
          width='760px'
          padding='0'
          onClose={() => setOpen(false)}
        >
          <ProfessionalInfo
            userId={professional?.id}
          />
        </Modal>
      )}
    </>
  )
}

export const SingleProfessionalCard = (props) => {
  const singleProfessionalCardProps = {
    ...props,
    UIComponent: SingleProfessionalCardUI
  }
  return <SingleProfessionalCardController {...singleProfessionalCardProps} />
}
